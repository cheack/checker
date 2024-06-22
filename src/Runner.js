import WebDriver from "./WebDriver";
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

                // if (action.element) {
                //     if (action.xpath) {
                //         element = webdriver.By.xpath(action.element)
                //     } else {
                //         element = webdriver.By.css(action.element)
                //     }
                // }

                switch (action.action) {
                    case 'load_site':
                        this.setMessage(`Loading "${action.url}"...`)
                        console.log(this.message)
                        await webdriver.loadURL(action.url)
                        break

                // case 'wait_for_element':
                //     this.message = action.log || `Waiting for element "${action.element}"...`
                //     await browser.wait(webdriver.until.elementLocated(element), 15 * 1000)
                //     break
                //
                // case 'type':
                //     this.message = `Typing "${action.text}" to "${action.element}"...`
                //     let input = await browser.findElement(element)
                //     input.sendKeys(action.text)
                //     break
                //
                // case 'click':
                //     this.message = action.log || `Clicking on "${action.element}"...`
                //     element = await browser.findElement(element)
                //     await element.click()
                //     break
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
                }

                this.addLog(
                    this.message.value,
                    await webdriver.takeScreenshot(),
                )

                console.log(this.log)
            }

            this.setMessage('Done.')
            this.addLog(this.message.value)
            this.done.value = true
        } catch (e) {
            this.error.value = `Error: ${e.message}`
            console.log(e)
            try {
                // await this.screenshot(browser)
            } finally {
            }
        } finally {
            this.running.value = false
            // await browser.quit()
        }
    }
}
