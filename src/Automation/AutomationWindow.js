const { BrowserWindow, ipcMain } = require('electron');

export default class AutomationWindow {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        ipcMain.on("automation-window-create", this.#action(this.createAutomationWindow.bind(this)));
        ipcMain.on("automation-window-load-url", this.#action(this.loadURL.bind(this)));
        ipcMain.on("automation-window-take-screenshot", this.#action(this.takeScreenshot.bind(this)));
        ipcMain.on("automation-window-find-element", this.#action(this.findElement.bind(this)));
        ipcMain.on("automation-window-type-text", this.#action(this.typeText.bind(this)));
        ipcMain.on("automation-window-click-element", this.#action(this.clickElement.bind(this)));
        ipcMain.on("automation-window-wait-for-element", this.#action(this.waitForElement.bind(this)));
    }

    successAction(message = null) {
        this.mainWindow.webContents.send("automation-window-success", message);
    }

    errorAction(message = null) {
        this.mainWindow.webContents.send("automation-window-error", {
            message: message,
            consoleLog: this.consoleLog,
        });
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

        this.consoleLog = [];
        const consoleMessageHandler = (event, level, message, line, sourceId) => {
            this.consoleLog.push({ message, line, sourceId });
        };
        this.window.webContents.on("console-message", consoleMessageHandler);

        const session = this.window.webContents.session;
        await session.clearStorageData();

        this.#registerGlobalFunctions();

        this.window.webContents.on("did-navigate", () => {
            this.#registerGlobalFunctions();
        });

        this.successAction("automation-window-created!");
    }

    #action(callback) {
        return async (event, ...args) => {
            try {
                await callback(event, ...args);
            } catch (error) {
                this.errorAction(error.message);
            }
        };
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
        if (!/^https?:\/\//.test(url)) {
            url = "https://" + url;
        }

        this.window.loadURL(url).then(() => {
            this.successAction("automation-window-url-loaded!");
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
            await this.window.webContents.executeJavaScript(`
                var element = window.getElement("${selector}");
                element.value = "${text}"
                var event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                element.dispatchEvent(event);
            `);
            this.successAction("automation-window-text-typed");
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
        const checkElementInPage = (selector) => {
            return this.window.webContents.executeJavaScript(`
                (() => {
                    return typeof window.getElement === "function" && window.getElement("${selector}") !== null
                })()
            `);
        };

        let elapsedTime = 0;

        const periodicCheck = async (resolve, reject) => {
            let elementFound = await checkElementInPage(selector);

            if (elementFound || elapsedTime >= 10000) {
                resolve(true);
            } else {
                setTimeout(periodicCheck, 250, resolve, reject);
            }
        };

        return new Promise((resolve, reject) => {
            periodicCheck(resolve, reject);
        });
    }
}
