<template>
    <div id="wrapper">
        <h1 v-if="isNew">New Task</h1>
        <h1 v-else>Edit Task</h1>

        <form class="ui form" ref="form">
            <div class="field">
                <label>Title</label>
                <input v-model="title" type="text" class="validate" name="title">
            </div>

            <div v-if="steps.length" class="ui styled accordion" ref="accordion">
                <Step
                    v-for="(step, idx) in steps"
                    :key="idx"
                    :initial-step="step"
                    @update="sync"
                    @delete="deleteStep"
                />
            </div>
            <p v-else>
                No actions
            </p>

            <a @click.stop="addStep" class="ui button">
                <i class="add icon"></i>
                Add Action
            </a>
            <div v-if="stepsError" class="field error">
                <div class="ui red pointing prompt label">Add at least one action</div>
            </div>
            <hr>
            <div class="ui submit button">
                <span v-if="isNew">Create</span>
                <span v-else>Update</span>
            </div>
        </form>
    </div>
</template>

<script>
    import Step from './Step'

    export default {
        name: 'task',
        computed: {
            task() {
                return this.$store.getters.taskById(+this.$route.params.id) || {steps: []}
            }
        },
        components: {Step},
        data: () => ({
            isNew: true,
            title: '',
            steps: [],
            stepsError: false,
        }),
        mounted() {
            this.title = this.task.title
            this.steps = this.task.steps
            this.isNew = !this.task.id

            this.$nextTick(function () {
                $(this.$refs.accordion).accordion()
                $(this.$refs.form)
                    .form({
                        fields: {
                            title: {
                                rules: [
                                    {
                                        type: 'empty',
                                        prompt: 'Enter a title',
                                    }
                                ]
                            },
                        },
                        inline: true,
                        on: 'submit',
                        onSuccess: this.submitHandler,
                    })
            })
        },
        methods: {
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
                steps.push({id: this.steps.length + 1})
                this.steps = steps
                this.stepsError = false

                this.$nextTick(function () {
                    $(this.$refs.accordion).accordion('refresh').accordion('open', this.steps.length - 1)
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
<style scoped>
    .accordion {
        margin-bottom: 10px;
    }
    [name=steps] {
        display: none;
    }
</style>
