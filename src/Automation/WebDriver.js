export default class WebDriver {
    constructor(mainWindow) {
        this.initIpcListeners();
    }

    initIpcListeners() {
        window.ipcRenderer.on("automation-window-success", this.handleSuccess);
        window.ipcRenderer.on("automation-window-error", this.handleError);
    }

    handleSuccess = (result) => {
        if (this.resolveFunction) {
            this.resolveFunction(result);
        }
    };

    handleError = (error) => {
        if (this.rejectFunction) {
            this.rejectFunction(error);
        }
    };

    async sendIpcMessage(channel, message = null) {
        return new Promise((resolve, reject) => {
            this.resolveFunction = resolve;
            this.rejectFunction = reject;

            window.ipcRenderer.send(channel, message);
        });
    }

    async createWindow() {
        await this.sendIpcMessage("automation-window-create");
    }

    async loadURL(url) {
        await this.sendIpcMessage("automation-window-load-url", url);
    }

    async findElement(selector) {
        return await this.sendIpcMessage("automation-window-find-element", selector);
    }

    async typeText(selector, text) {
        await this.sendIpcMessage("automation-window-type-text", { selector, text });
    }

    async clickElement(selector) {
        await this.sendIpcMessage("automation-window-click-element", selector);
    }

    async takeScreenshot() {
        return await this.sendIpcMessage("automation-window-take-screenshot");
    }

    async waitForElement() {
        return await this.sendIpcMessage("automation-window-wait-for-element");
    }
}
