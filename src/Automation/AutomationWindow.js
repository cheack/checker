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
                offscreen: true
            }
        });
        this.window.webContents.openDevTools();

        this.successAction('automation-window-created!');
    }

    async loadURL(sender, url) {
        this.window.loadURL('https://' + url).then(() => {
            this.successAction('automation-window-url-loaded!');
        });

    }

    async takeScreenshot() {
        let image = await this.window.webContents.capturePage()
        this.successAction(image.toDataURL());
    }

    async findElement(event, selector) {
        const elementExists = await this.checkElementExists(selector);
        this.successAction(elementExists);
    }

    async typeText(event, { selector, text }) {
        const elementExists = await this.checkElementExists(selector);

        if (elementExists) {
            await this.window.webContents.executeJavaScript(`document.querySelector("${selector}").value = "${text}"`);
            this.successAction('automation-window-text-typed');
        } else {
            this.errorAction('error: element not found')
        }
    }

    async clickElement(event, selector) {
        const elementExists = await this.checkElementExists(selector);

        if (elementExists) {
            await this.window.webContents.executeJavaScript(`document.querySelector("${selector}").click()`);
            this.successAction('automation-window-element-clicked');
        } else {
            this.errorAction('error: element not found or cannot click')
        }
    }

    async checkElementExists(selector) {
        return await this.window.webContents.executeJavaScript(`
            new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (document.querySelector("${selector}")) {
                        clearInterval(interval);
                        resolve(true);
                    }
                }, 100);
                setTimeout(() => {
                    clearInterval(interval);
                    resolve(false);
                }, 10000);
            });
        `);
    }
}
