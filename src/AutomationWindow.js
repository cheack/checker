const { BrowserWindow, ipcMain } = require('electron');

export default class AutomationWindow {
    constructor(mainWindow) {
        this.mainWindow = mainWindow
        ipcMain.on('automation-window-create', this.createAutomationWindow.bind(this));
        ipcMain.on('automation-window-load-url', this.loadURL.bind(this));
        ipcMain.on('automation-window-take-screenshot', this.takeScreenshot.bind(this));
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

        this.mainWindow.webContents.send('automation-window-created', 'automation-window-created!');


    }

    async loadURL(sender, url) {
        this.window.loadURL('https://' + url).then(() => {
            this.mainWindow.webContents.send('automation-window-url-loaded', 'automation-window-url-loaded!');
        });

    }

    async takeScreenshot() {
        let image = await this.window.webContents.capturePage()
        this.mainWindow.webContents.send('automation-window-screenshot-taken', image.toDataURL());
    }
}
