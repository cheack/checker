<template>
    <div id="wrapper">
        <h1 v-if="isNew">New Task</h1>
        <h1 v-else>Edit Task</h1>

        <form class="needs-validation" ref="form" novalidate>
            <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input v-model="title" type="text" class="form-control" id="title" name="title" required>
                <div class="invalid-feedback">
                    Title is required.
                </div>
            </div>


            <div v-if="steps.length"  class="accordion" id="accordionExample">
                <Step
                    v-for="(step) in steps"
                    :key="step.order"
                    :initial-step="step"
                    @update="sync"
                    @delete="deleteStep"
                />
            </div>
<!--            <draggable v-if="steps.length" class="accordion"-->
<!--                       :list="steps"-->
<!--                       v-bind="dragOptions"-->
<!--                       :component-data="getAccordionData()"-->
<!--            >-->

<!--            </draggable>-->
            <p v-else>
                No actions
            </p>

            <button type="button" @click.stop="addStep" class="btn btn-primary mb-3">
                <i class="bi bi-plus-lg"></i>
                Add Action
            </button>
            <div v-if="stepsError" class="mb-3">
                <div class="alert alert-danger">Add at least one action</div>
            </div>
            <hr>
            <button type="submit" class="btn btn-success">
                <span v-if="isNew">Create</span>
                <span v-else>Update</span>
            </button>
        </form>
    </div>
</template>

<script>
    import Step from './Step.vue'
    // import draggable from 'vuedraggable'

    export default {
        name: 'task',
        computed: {
            task() {
                return this.$store.getters.taskById(+this.$route.params.id) || {steps: []}
            },
            dragOptions() {
                return {
                    ghostClass: 'ghost'
                }
            }
        },
        components: {
            Step,
            // draggable,
        },
        data: () => ({
            isNew: true,
            title: '',
            steps: [],
            stepsError: false,
        }),
        mounted() {
            this.title = this.task.title
            let steps = JSON.parse(JSON.stringify(this.task.steps))
            steps.forEach(function (element, index) {
                element.order = index + 1
            })

            this.steps = steps
            this.isNew = !this.task.id

            this.$nextTick(function () {
                // $('[ref=accordion]').accordion()
                // $(this.$refs.form)
                //     .form({
                //         fields: {
                //             title: {
                //                 rules: [
                //                     {
                //                         type: 'empty',
                //                         prompt: 'Enter a title',
                //                     }
                //                 ]
                //             },
                //         },
                //         inline: true,
                //         on: 'submit',
                //         onSuccess: this.submitHandler,
                //     })
            })
        },
        methods: {
            getAccordionData() {
                return {
                    attrs: {
                        ref: 'accordion'
                    },
                }
            },
            sync: function(stepData) {
                let index = this.steps.findIndex((step) => step.id === stepData.id)
                this.steps[index] = stepData
            },
            addStep() {
                if (this.steps.length) {
                    let lastStep = this.steps[this.steps.length - 1]
                    if (lastStep && !lastStep.action) {
                        return
                    }
                }
                let steps = this.steps.concat()
                steps.push({id: this.steps.length + 1, order: this.steps.length + 1})
                this.steps = steps
                this.stepsError = false

                this.$nextTick(function () {
                    // $('[ref=accordion]').accordion('refresh').accordion('open', this.steps.length - 1)
                })
            },
            deleteStep: function(stepId) {
                let steps = this.steps.concat()
                let index = steps.findIndex((step) => step.id === stepId)
                steps.splice(index, 1)
                this.steps = steps
            },
            submitHandler(event) {
                event.preventDefault()

                if (!this.steps.length) {
                    this.stepsError = true
                    return
                }
                const task = {
                    id: this.task.id,
                    title: this.title,
                    steps: this.steps,
                }

                this.$store.dispatch('storeTask', task)
                this.$router.push('/list')
            }
        },
    }
</script>
<style lang="scss" scoped>
    .accordion {
        margin-bottom: 10px;

        > div {
            background: white;
        }
    }

    .button {
        margin-top: 35px;
    }

    .ghost {
        opacity: 0.5;
        background: #c8ebfb !important;
    }

</style>
