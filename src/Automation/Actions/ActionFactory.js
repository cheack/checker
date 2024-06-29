import Click from './Click';
import LoadUrl from './LoadUrl';
import Type from './Type';
import WaitForElement from './WaitForElement';

export default class ActionFactory {
    static get(action, webdriver) {
        switch (action.action) {
            case 'load_site':
                return new LoadUrl(action, webdriver);

            case 'type':
                return new Type(action, webdriver);

            case 'click':
                return new Click(action, webdriver);

            case 'wait_for_element':
                return new WaitForElement(action, webdriver);
        }
    }
}
