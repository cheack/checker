export default class Runner {
    constructor() {
        this.message = null
        this.log = []
        this.result = []
        this.error = null
        this.running = false
        this.done = false
    }

    set steps(steps) {
        this.actions = steps
    }

    async run() {
        this.running = true
        this.message = 'Opening browser...'
        this.log.push({'message': this.message})

        const webdriver = require('selenium-webdriver')
        const browser = new webdriver.Builder()
            .usingServer('http://localhost:4444/wd/hub/')
            .withCapabilities({ 'browserName': 'chrome' })
            .build()

        await browser.manage().window().setRect({ width: 1366, height: 1024, x: 0, y: 0 })

        try {
            for (let i = 0; i < this.actions.length; i++) {
                let element
                let action = this.actions[i]

                if (action.element) {
                    if (action.xpath) {
                        element = webdriver.By.xpath(action.element)
                    } else {
                        element = webdriver.By.css(action.element)
                    }
                }

                switch (action.action) {
                case 'load_site':
                    this.message = `Loading "${action.url}"...`
                    await browser.get(action.url)
                    break

                case 'wait_for_element':
                    this.message = action.log || `Waiting for element "${action.element}"...`
                    await browser.wait(webdriver.until.elementLocated(element), 15 * 1000)
                    break

                case 'type':
                    this.message = `Typing "${action.text}" to "${action.element}"...`
                    let input = await browser.findElement(element)
                    input.sendKeys(action.text)
                    break

                case 'click':
                    this.message = action.log || `Clicking on "${action.element}"...`
                    element = await browser.findElement(element)
                    await element.click()
                    break

                case 'get_text':
                    this.message = action.log || `Getting text from "${action.element}"...`
                    let elements = await browser.findElements(element)

                    let values = []
                    for (let i = 0; i < elements.length; i++) {
                        values.push(await elements[i].getText())
                    }
                    this.result.push({
                        step: i,
                        values: values,
                    })
                    break
                }

                this.log.push({
                    message: this.message,
                    screenshot: await browser.takeScreenshot()
                })
            }

            this.message = 'Done.'
            this.log.push({message: this.message})
            this.done = true
        } catch (e) {
            this.error = `Error: ${e.message}`
            console.log(e)
            try {
                // await this.screenshot(browser)
            } finally {
            }
        } finally {
            this.running = false
            await browser.quit()
        }
    }
}
