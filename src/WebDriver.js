export default class WebDriver {
    constructor() {

    }

    async createWindow() {
        function create() {
            window.ipcRenderer.send('automation-window-create');

            return new Promise((resolve) => {
                window.ipcRenderer.on('automation-window-created', (result) => {
                    resolve(result)
                });
            });
        }

        await create();
    }

    async loadURL(url) {
        function load() {
            window.ipcRenderer.send('automation-window-load-url', url);

            return new Promise((resolve) => {
                window.ipcRenderer.on('automation-window-url-loaded', () => {
                    resolve()
                });
            });
        }

        await load();
    }

    async takeScreenshot() {
        function take() {
            window.ipcRenderer.send('automation-window-take-screenshot');

            return new Promise((resolve) => {
                window.ipcRenderer.on('automation-window-screenshot-taken', (result) => {
                    resolve(result)
                });
            });
        }

        return await take();
    }
}
