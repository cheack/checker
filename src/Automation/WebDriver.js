export default class WebDriver {
    async sendIpcMessage(channel, message = null) {
        return new Promise((resolve, reject) => {
            window.ipcRenderer.send(channel, message);
            window.ipcRenderer.on('automation-window-success', (result) => resolve(result));
            window.ipcRenderer.on('automation-window-error', (error) => reject(error));
        });
    }

    async createWindow() {
        await this.sendIpcMessage('automation-window-create');
    }

    async loadURL(url) {
        await this.sendIpcMessage('automation-window-load-url', url);
    }

    async findElement(selector) {
        return await this.sendIpcMessage('automation-window-find-element', selector);
    }

    async typeText(selector, text) {
        await this.sendIpcMessage('automation-window-type-text', { selector, text });
    }

    async clickElement(selector) {
        await this.sendIpcMessage('automation-window-click-element', selector);
    }

    async takeScreenshot() {
        return await this.sendIpcMessage('automation-window-take-screenshot');
    }
}