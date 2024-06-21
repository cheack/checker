<template>
    <div>
        <div class="title">
            <i class="dropdown icon"></i>
            <div class="step-title" v-html="getStepHeader()"></div>
            <div class="indicators">
                <i @click.stop="remove" class="red trash icon" title="Delete"></i>
            </div>
        </div>
        <div class="ui form content">
            <div class="field">
                <label>Action</label>
                <select ref="action" v-model="action" class="ui dropdown">
                    <option value="">Choose your action</option>
                    <option value="load_site">Load Site</option>
                    <option value="type">Type text</option>
                    <option value="click">Click on element</option>
                    <option value="wait_for_element">Wait for element</option>
                    <option value="get_text">Get element text</option>
                </select>
            </div>

            <div v-if="action === 'load_site'" class="field">
                <label>URL</label>
                <input type="text" v-model="url">
            </div>

            <div v-if="['type', 'click', 'wait_for_element', 'get_text'].includes(action)" class="two fields">
                <div class="twelve wide field">
                    <label>Element</label>
                    <input type="text" v-model="element">
                </div>
                <div class="four wide field">
                    <div class="ui checkbox">
                        <input type="checkbox" :checked="xpath" v-model="xpath" class="hidden" :id="`xpath${id}`"/>
                        <label :for="`xpath${id}`">xpath</label>
                    </div>
                </div>
            </div>

            <div v-if="action === 'type'" class="field">
                <label>Text to type</label>
                <input type="text" v-model="text">
            </div>

            <div class="field">
                <label>Custom log text</label>
                <input type="text" v-model="log">
            </div>
        </div>
    </div>
</template>

<script>
    import { escapeHtml} from "../../util";

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
                order: this.initialStep.order || 1,
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
                    order: this.order,
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
                let url = escapeHtml(this.url || '')
                let element = escapeHtml(this.element || '')
                let text = escapeHtml(this.text || '')

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
        },
        mounted() {
            $(this.$refs.action).dropdown()
        }
    }
</script>

<style lang="scss" >
    .title * {
        color: rgba(0,0,0,.95);
    }
    .step-title {
        display: inline;
        font-weight: normal;

        span {
            font-weight: bold;
        }
    }
    .indicators {
        float: right;
    }
</style>
