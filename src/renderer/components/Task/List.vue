<template>
    <div>
        <h1>List</h1>

        <hr>

        <table v-if="tasks.length" class="ui celled table">
            <tbody>
            <tr
                v-for="(task, idx) of tasks"
                :key="idx"
            >
                <td>
                    <button class="ui blue icon button" :class="{loading: isRunning(task.id)}" :disabled="isRunning(task.id)" @click="run(task.id)">
                        <i class="play icon"></i>
                    </button>

                    <span class="title">{{task.title}}</span>

                    <RunnerLog v-if="runners[task.id]"
                        :runner="runners[task.id]"
                        :task-id="task.id"
                    />
                </td>
                <td style="width: 20%">
                    <router-link tag="button" class="ui button" :to="'/task/' + task.id">
                        Edit
                    </router-link>
                    <button class="ui red button" @click="remove(task.id)">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
        <p v-else>No tasks</p>
    </div>
</template>

<script>
    import Runner from '../../Runner'
    import RunnerLog from './RunnerLog'

    export default {
        components: { RunnerLog },
        computed: {
            tasks() {
                return this.$store.getters.tasks
            }
        },
        data() {
            return {
                runners: {},
            }
        },
        methods: {
            isRunning(taskId) {
                return this.runners[taskId] && this.runners[taskId].running
            },
            remove(taskId) {
                if (confirm('Are you sure?')) {
                    this.$store.dispatch('deleteTask', taskId)
                }
            },
            run(taskId) {
                const task = this.$store.getters.taskById(taskId)
                let runner = new Runner()
                runner.steps = task.steps
                runner.run()
                this.$set(this.runners, taskId, runner)
            },
        },
    }
</script>

<style lang="scss" scoped>
    td {
        vertical-align: top;
    }

    .text {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .title {
        padding-left: 5px;
    }
</style>