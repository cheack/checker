import AbstractAction from './AbstractAction';

export default class Type extends AbstractAction {
    async run() {
        await this.webdriver.typeText(this.action.element, this.action.text);
    }

    get message() {
        return `Typing "${this.action.text}" to "${this.action.element}"...`
    }
}
