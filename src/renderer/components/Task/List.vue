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
                    <p v-if="task.lastLog">
                        <a @click="showLog(`lastLog${task.id}`)"><i class="camera icon" title="Show last log" ></i></a>
                        <RunnerLog :log="task.lastLog" :ref="`lastLog${task.id}`"/>
                    </p>

                    <button class="ui blue icon button" :class="{loading: isRunning(task.id)}" :disabled="isRunning(task.id)" @click="run(task.id)">
                        <i class="play icon"></i>
                    </button>

                    <span class="title">{{task.title}}</span>

                    <RunnerProgress v-if="runners[task.id]"
                        :runner="runners[task.id]"
                        :task-id="task.id"
                        :last-log="task.lastLog"
                        @update="saveLog"
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
    import RunnerProgress from './RunnerProgress'

    export default {
        components: { RunnerLog, RunnerProgress },
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
            saveLog: function(log) {
                this.$store.dispatch('setTaskLog', log)
            },
            showLog: function(ref) {
                this.$refs[ref][0].show()
            },
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
