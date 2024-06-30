<template>
    <div id="wrapper">
        <h1 v-if="isNew">New Task</h1>
        <h1 v-else>Edit Task</h1>

        <div class="needs-validation">
            <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input v-model="title" type="text" class="form-control" id="title" name="title" required>
                <div v-if="errors.title" class="invalid-feedback d-block">
                    Title is required.
                </div>
            </div>


            <div v-if="steps.length" class="accordion">
                 <draggable class="dragArea" :list="steps" >
                    <div class="accordion-item" v-for="step in steps" :key="step.order">
                        <Step
                            :initial-step="step"
                            @update="sync"
                            @delete="deleteStep"
                        />
                    </div>
                </draggable>
            </div>

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
            <a @click="submitHandler" class="btn btn-success">
                <span v-if="isNew">Create</span>
                <span v-else>Update</span>
            </a>
        </div>
    </div>
</template>

<script>
import Step from './Step.vue'
import { VueDraggableNext } from 'vue-draggable-next'

export default {
    name: 'task',
    computed: {
        task() {
            return this.$store.getters.taskById(+this.$route.params.id) || {steps: []}
        },
    },
    components: {
        Step,
        draggable: VueDraggableNext,
    },
    data: () => ({
        isNew: true,
        title: '',
        steps: [],
        stepsError: false,
        errors: {},
    }),
    mounted() {
        this.title = this.task.title
        let steps = JSON.parse(JSON.stringify(this.task.steps))
        steps.forEach(function (element, index) {
            element.order = index + 1
        })

        this.steps = steps
        this.isNew = !this.task.id
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
        submitHandler() {
            if (!this.title.trim()) {
                this.errors.title = true
                return
            }
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
</style>
