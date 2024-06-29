import AbstractAction from './AbstractAction';

export default class WaitForElement extends AbstractAction {
    async run() {
        await this.webdriver.waitForElement(this.action.element);
    }

    get message() {
        return `Waiting for element "${this.action.element}"...`
    }
}
