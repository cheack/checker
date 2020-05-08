<template>
    <div id="wrapper">
        <h1 v-if="isNew">New Task</h1>
        <h1 v-else>Edit Task</h1>

        <form @submit.prevent="submitHandler">
            <div class="input-field">
                <input id="title" v-model="title" type="text" class="validate" required>
                <label for="title">Title</label>
                <span class="helper-text" data-error="Title is required"></span>
            </div>

            <ul v-if="steps.length" class="collapsible" ref="collapsible">
                <Step
                    v-for="(step, idx) in steps"
                    :key="idx"
                    :initial-step="step"
                    @update="sync"
                    @delete="deleteStep"
                />
            </ul>
            <p v-else>
                No actions
            </p>

            <a class="btn" @click="addStep">
                Add Action
            </a>

            <hr>
            <button class="btn" type="submit">
                <span v-if="isNew">Create</span>
                <span v-else>Update</span>
            </button>
        </form>
    </div>
</template>

<script>
    import M from 'materialize-css'
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
        }),
        mounted() {
            this.title = this.task.title
            this.steps = this.task.steps
            this.isNew = !this.task.id

            this.$nextTick(function () {
                this.initCollapsible()
                M.updateTextFields()
            })
        },
        methods: {
            initCollapsible() {
                this.collapsible = M.Collapsible.init(this.$refs.collapsible, {})
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
                steps.push({id: this.steps.length + 1})
                this.steps = steps

                this.$nextTick(function () {
                    if (this.steps.length === 1) {
                        this.initCollapsible()
                    }
                    this.collapsible.open(this.steps.length - 1)
                })
            },
            deleteStep: function(stepId) {
                let steps = this.steps.concat()
                let index = steps.findIndex((step) => step.id === stepId)
                steps.splice(index, 1)
                this.steps = steps
            },
            submitHandler() {
                const task = {
                    id: this.task.id,
                    title: this.title,
                    steps: this.steps,
                }

                this.$store.dispatch('storeTask', task)
                this.$router.push('/list')
            }
        },
        destroyed() {
            if (this.collapsible && this.collapsible.destroy) {
                this.collapsible.destroy()
            }
        }
    }
</script>
<style scoped>
    #steps {
        overflow: visible;
    }
</style>
