<template>
    <li>
        <div class="collapsible-header truncate">
            <div v-html="getStepHeader()"></div>
            <div class="indicators">
                <i @click="remove" class="tiny material-icons tooltipped" data-tooltip="Delete">delete</i>
            </div>
        </div>
        <div class="collapsible-body">
            <div class="row">
                <div class="input-field col s6">
                    <select ref="action" v-model="action">
                        <option value="" disabled selected>Choose your action</option>
                        <option value="load_site">Load Site</option>
                        <option value="type">Type text</option>
                        <option value="click">Click on element</option>
                        <option value="wait_for_element">Wait for element</option>
                        <option value="get_text">Get element text</option>
                    </select>
                    <label>Action</label>
                </div>
            </div>

            <div v-if="action === 'load_site'" class="row">
                <div class="input-field col s6">
                    <input type="text" v-model="url" :id="`url${id}`">
                    <label :for="`url${id}`">URL</label>
                </div>
            </div>

            <div v-if="['type', 'click', 'wait_for_element', 'get_text'].includes(action)" class="row">
                <div class="input-field col s6">
                    <input type="text" v-model="element" :id="`element${id}`">
                    <label :for="`element${id}`">Element</label>
                </div>
                <p>
                    <label>
                        <input type="checkbox" :checked="xpath" v-model="xpath"/>
                        <span>xpath</span>
                    </label>
                </p>
            </div>

            <div v-if="action === 'type'" class="row">
                <div class="input-field col s6">
                    <input type="text" v-model="text" :id="`text${id}`">
                    <label :for="`text${id}`">Text to type</label>
                </div>
            </div>

            <div class="row">
                <div class="input-field col s6">
                    <input type="text" v-model="log" :id="`log${id}`">
                    <label :for="`log${id}`">Custom log text</label>
                </div>
            </div>
        </div>
    </li>
</template>

<script>
    import M from 'materialize-css'

    export default {
        name: 'step',
        props: {
            initialStep: Object,
        },
        data() {
            return {
                id: this.initialStep.id || Date.now(),
                action: this.initialStep.action,
                element: this.initialStep.element,
                text: this.initialStep.text || '',
                url: this.initialStep.url || '',
                xpath: this.initialStep.xpath || false,
                log: this.initialStep.log || '',
            }
        },
        computed: {
            compoundProperty() {
                return {
                    id: this.id,
                    action: this.action,
                    element: this.element,
                    text: this.text,
                    url: this.url,
                    xpath: this.xpath,
                    log: this.log,
                }
            }
        },
        watch: {
            compoundProperty: function (val) {
                this.$emit('update', val)
            },
        },
        methods: {
            getStepHeader() {
                let url = this.escapeHtml(this.url || '')
                let element = this.escapeHtml(this.element || '')
                let text = this.escapeHtml(this.text || '')

                switch (this.action) {
                case 'load_site':
                    return `Load URL <span>${url}</span>`
                case 'wait_for_element':
                    return `Wait for element <span>${element}</span>`
                case 'type':
                    return `Type text <span>${text}</span> into <span>${element}</span>`
                case 'click':
                    return `Click on <span>${element}</span>`
                case 'get_text':
                    return `Get text from <span>${element}</span>`
                default:
                    return 'New action'
                }
            },
            remove() {
                if (confirm('Are you sure?')) {
                    this.$emit('delete', this.id)
                }
            },
            updateMaterialize() {
                M.updateTextFields()
                this.tooltips = M.Tooltip.init(document.querySelectorAll('.tooltipped'))
                this.formSelect = M.FormSelect.init(this.$refs.action)
            }
        },
        updated() {
            this.updateMaterialize()
        },
        mounted() {
            this.updateMaterialize()
        },
        destroyed() {
            if (this.formSelect && this.formSelect.destroy) {
                this.formSelect.destroy()
            }
            if (this.tooltips) {
                this.tooltips.forEach((el) => { el.destroy() })
            }
        }
    }
</script>

<style lang="scss" >
    .collapsible-header {
        position: relative;

        span {
            font-weight: bold;
        }

        .indicators {
            position: absolute;
            right: 0;
        }
    }
</style>
