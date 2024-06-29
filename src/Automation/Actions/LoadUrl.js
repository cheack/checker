import AbstractAction from './AbstractAction';

export default class LoadUrl extends AbstractAction {
    async run() {
        await this.webdriver.loadURL(this.action.url)
    }

    get message() {
        return `Loading "${this.action.url}"...`
    }
}
