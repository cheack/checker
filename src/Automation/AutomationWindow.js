const { BrowserWindow, ipcMain } = require('electron');

export default class AutomationWindow {
    constructor(mainWindow) {
        this.mainWindow = mainWindow
        ipcMain.on('automation-window-create', this.createAutomationWindow.bind(this));
        ipcMain.on('automation-window-load-url', this.loadURL.bind(this));
        ipcMain.on('automation-window-take-screenshot', this.takeScreenshot.bind(this));
        ipcMain.on('automation-window-find-element', this.findElement.bind(this));
        ipcMain.on('automation-window-type-text', this.typeText.bind(this));
        ipcMain.on('automation-window-click-element', this.clickElement.bind(this));
        ipcMain.on("automation-window-wait-for-element", this.waitForElement.bind(this));
    }

    successAction(message = null) {
        this.mainWindow.webContents.send('automation-window-success', message);
    }

    errorAction(message = null) {
        this.mainWindow.webContents.send('automation-window-error', message);
    }

    async createAutomationWindow() {
        this.window = new BrowserWindow({
            // width: 500,
            // height: 500,
            show: false,
            webPreferences: {
                offscreen: true,
            },
        });

        this.#registerGlobalFunctions();

        this.window.webContents.on("did-navigate", () => {
            this.#registerGlobalFunctions();
        });

        this.successAction("automation-window-created!");
    }

    #registerGlobalFunctions() {
        this.window.webContents.executeJavaScript(`
            window.getElement = (selectorOrXpath) => {
                try {
                    return document.querySelector(selectorOrXpath);
                } catch (e) {
                    try {
                        return document.evaluate(selectorOrXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    } catch (e) {
                        return null;
                    }
                }
            };
        `);
    }

    async loadURL(sender, url) {
        this.window.loadURL('https://' + url).then(() => {
            this.successAction('automation-window-url-loaded!');
        });
    }

    async takeScreenshot() {
        let image = await this.window.webContents.capturePage();
        this.successAction(image.toDataURL());
    }

    async findElement(event, selector) {
        const elementExists = await this.waitForElementOnPage(selector);
        this.successAction(elementExists);
    }

    async typeText(event, { selector, text }) {
        const elementExists = await this.waitForElementOnPage(selector);

        if (elementExists) {
            await this.window.webContents.executeJavaScript(`window.getElement("${selector}").value = "${text}"`);
            this.successAction('automation-window-text-typed');
        } else {
            this.errorAction(`error: element ${selector} not found`);
        }
    }

    async clickElement(event, selector) {
        const elementExists = await this.waitForElementOnPage(selector);

        if (elementExists) {
            await this.window.webContents.executeJavaScript(`window.getElement("${selector}").click()`);
            this.successAction("automation-window-element-clicked");
        } else {
            this.errorAction("error: element not found or cannot click");
        }
    }

    async waitForElement(event, selector) {
        const elementExists = await this.waitForElementOnPage(selector);

        if (elementExists) {
            this.successAction("automation-window-wait-for-element-success");
        } else {
            this.errorAction(`error: element ${selector} not found`);
        }
    }

    // Function to check if element exists, including after redirects
    async waitForElementOnPage(selector) {
        const checkElementInPage = async (selector) => {
            return await this.window.webContents.executeJavaScript(`
                new Promise((resolve) => {
                    if (window.getElement("${selector}")) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            `);
        };

        let elementFound = false;
        let elapsedTime = 0;

        const periodicCheck = async (resolve, reject) => {
            elementFound = await checkElementInPage(selector);
            elapsedTime += 250;
            if (elementFound || elapsedTime >= 10000) {
                clearTimeout(timeout);
                resolve(elementFound);
            } else {
                setTimeout(periodicCheck, 250, resolve, reject);
            }
        };

        const timeout = setTimeout(() => {
            periodicCheck(
                (result) => {},
                (error) => {}
            );
        }, 250);

        return new Promise((resolve, reject) => {
            periodicCheck(resolve, reject);
        });
    }
}
