<template>
    <div>
        <h1>List</h1>

        <hr>

        <table v-if="tasks.length" class="table table-bordered">
            <tbody>
            <tr v-for="(task, idx) in tasks" :key="idx">
                <td>
                    <p v-if="task.lastLog">
                        <a @click="showLog(`lastLog${task.id}`)">
                            <i class="bi bi-camera" title="Show last log"></i>
                        </a>
                        <RunnerLog :log="task.lastLog" :ref="`lastLog${task.id}`" />
                    </p>

                    <button class="btn btn-primary" :class="{ 'spinner-border': isRunning(task.id) }" :disabled="isRunning(task.id)" @click="run(task.id)">
                        <i class="bi bi-play"></i>
                    </button>

                    <span class="title">{{ task.title }}</span>

                    <RunnerProgress v-if="runners[task.id]" :runner="runners[task.id]"/>
                </td>
                <td style="width: 20%">
                    <router-link tag="button" class="btn btn-secondary" :to="'/task/' + task.id">
                        Edit
                    </router-link>
                    <button class="btn btn-danger" @click="remove(task.id)">Delete</button>
                    <button class="btn btn-primary" @click="clone(task.id)">Clone</button>
                </td>
            </tr>
            </tbody>
        </table>
        <p v-else>No tasks</p>
    </div>
</template>

<script>
import Runner from '../../Runner';
import RunnerLog from './RunnerLog.vue';
import RunnerProgress from './RunnerProgress.vue';
import { watch } from 'vue';

    export default {
        components: { RunnerLog, RunnerProgress },
        computed: {
            tasks() {
                return this.$store.getters.tasks
            }
        },
        data() {
            return {
                runners: {}
            }
        },
        methods: {
            showLog(ref) {
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
            clone(taskId) {
                this.$store.dispatch('cloneTask', taskId)
            },
            run(taskId) {
                const task = this.$store.getters.taskById(taskId)
                let runner = new Runner()
                runner.steps = task.steps
                this.runners[taskId] = runner;
                runner.run()
                task.lastLog = runner.log;

                // Наблюдаем за изменениями логов и сохраняем в сторе
                watch(() => runner.log, (newLogs) => {
                    this.$store.dispatch('saveTaskLog', { taskId, log: newLogs });
                }, { deep: true });
            },
        },
    };
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
