import ActionFactory from './Automation/Actions/ActionFactory';
import WebDriver from "./Automation/WebDriver";
import { ref } from "vue";

export default class Runner {
    constructor() {
        this.message = ref()
        this.log = ref([])
        this.result = []
        this.error = ref()
        this.running = ref(false)
        this.done = ref(false)
    }

    set steps(steps) {
        this.actions = steps
    }

    setMessage(message) {
        this.message.value = message
    }

    addLog(message, screenshot = null) {
        this.log.value.push({
            message,
            screenshot,
            timestamp: new Date().toLocaleTimeString(),
        });
    }

    async run() {
        this.running.value = true
        this.setMessage('Opening browser...')
        this.addLog(this.message)

        const webdriver = new WebDriver
        await webdriver.createWindow()

        try {
            for (let i = 0; i < this.actions.length; i++) {
                let element
                let action = this.actions[i]

                const actionClass = ActionFactory.get(action, webdriver);
                this.setMessage(actionClass.message);
                await actionClass.run();


                //
                // case 'get_text':
                //     this.message = action.log || `Getting text from "${action.element}"...`
                //     let elements = await browser.findElements(element)
                //
                //     let values = []
                //     for (let i = 0; i < elements.length; i++) {
                //         values.push(await elements[i].getText())
                //     }
                //     this.result.push({
                //         step: i,
                //         values: values,
                //     })
                //     break
                // }

                this.addLog(
                    this.message.value,
                    await webdriver.takeScreenshot(),
                )
            }

            this.setMessage('Done.')
            this.addLog(this.message.value)
            this.done.value = true
        } catch (e) {
            this.error.value =
                `Error on step "${this.message.value}":\n ${e.message}\n\nConsole log:\n` +
                e.consoleLog.map((log) => `- ${log.message}`).join("\n");

            try {
                this.addLog(
                    this.message.value,
                    await webdriver.takeScreenshot(),
                )
            } finally {
            }
        } finally {
            this.running.value = false
            // await browser.quit()
        }
    }
}
