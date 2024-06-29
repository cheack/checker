import AbstractAction from './AbstractAction';

export default class Click extends AbstractAction {
    async run() {
        await this.webdriver.clickElement(this.action.element);
    }

    get message() {
        return `Clicking on "${this.action.element}"...`
    }
}
