<template>
    <h2 class="accordion-header position-relative drag-handle">
        <button class="accordion-button collapsed z-1" type="button" data-bs-toggle="collapse" :data-bs-target="`#collapse${id}`" aria-controls="collapseOne">
            <div class="step-title" v-html="getStepHeader()"></div>
        </button>
         <div class="indicators position-absolute z-2 h-100 d-flex align-items-center">
            <i @click="remove" class="delete-step bi bi-trash text-danger" title="Delete"></i>
        </div>
    </h2>

    <div :id="`collapse${id}`" class="accordion-collapse collapse"  data-bs-parent="#accordionExample">
        <div class="accordion-body">
            <div class="mb-3">
                <label for="action" class="form-label">Action</label>
                <select ref="action" v-model="action" class="form-select" id="action">
                    <option value="">Choose your action</option>
                    <option value="load_site">Load Site</option>
                    <option value="type">Type text</option>
                    <option value="click">Click on element</option>
                    <option value="wait_for_element">Wait for element</option>
                    <option value="get_text">Get element text</option>
                </select>
            </div>

            <div v-if="action === 'load_site'" class="mb-3">
                <label for="url" class="form-label">URL</label>
                <input type="text" v-model="url" class="form-control" id="url">
            </div>

            <div v-if="['type', 'click', 'wait_for_element', 'get_text'].includes(action)" class="row mb-3">
                <div class="col-8">
                    <label for="element" class="form-label">Element (selector or xpath)</label>
                    <input type="text" v-model="element" class="form-control" id="element">
                </div>
            </div>

            <div v-if="action === 'type'" class="mb-3">
                <label for="text" class="form-label">Text to type</label>
                <input type="text" v-model="text" class="form-control" id="text">
            </div>

            <div class="mb-3">
                <label for="log" class="form-label">Custom log text</label>
                <input type="text" v-model="log" class="form-control" id="log">
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
        emits: {
            update: null,
            delete: null,
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
            // $(this.$refs.action).dropdown()
        }
    }
</script>

<style lang="scss">
    .step-title {
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 25px;

        span {
            font-weight: bold;
        }
    }
    .accordion-header {
        &:hover {
            .indicators {
                visibility: visible;
            }
        }
    }
    .indicators {
        cursor: pointer;
        visibility: hidden;
        top: 0;
        right: 50px;

        .delete-step {
            font-size: 20px;
        }
    }
</style>
