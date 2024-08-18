<template>
    <tr>
        <td>
            <p v-if="task.lastLog">
                <a @click="showLog(`lastLog${task.id}`)">
                    <i class="bi bi-camera" title="Show last log"></i>
                </a>
                <RunnerLog :log="task.lastLog" :ref="`lastLog${task.id}`" />
            </p>

            <button class="btn btn-primary" @click="isRunning(task.id) ? stop(task.id) : run(task.id)" @mouseenter="this.runButtonHovered = true" @mouseleave="this.runButtonHovered = false">
                <span v-if="this.runButtonHovered">
                    <span v-if="isRunning(task.id)" class="bi bi-stop-fill"></span>
                </span>
                <span v-if="!this.runButtonHovered && isRunning(task.id)">
                    <span class="spinner-border spinner-border-sm"></span>
                </span>
                <span v-if="!isRunning(task.id)">
                    <span class="bi bi-play"></span>
                </span>
            </button>

            <span class="title">{{ task.title }}</span>

            <RunnerProgress v-if="runner" :runner="runner"/>
        </td>
        <td style="width: 20%">
            <router-link tag="button" class="btn btn-secondary" :to="'/task/' + task.id">
                Edit
            </router-link>
            <button class="btn btn-danger" @click="remove(task.id)">Delete</button>
            <button class="btn btn-primary" @click="clone(task.id)">Clone</button>
        </td>
    </tr>
</template>

<script>
import Runner from '../../Runner';
import RunnerLog from './RunnerLog.vue';
import RunnerProgress from './RunnerProgress.vue';
import { watch } from 'vue';

export default {
    components: {
        RunnerLog,
        RunnerProgress,
    },
    props: ['key', 'task'],
    data() {
        return {
            runner: null,
            runButtonHovered: false,
        }
    },
    methods: {
        showLog(ref) {
            this.$refs[ref][0].show()
        },
        isRunning(taskId) {
            return this.runner?.running;
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
            this.runner = runner;
            runner.run()
            task.lastLog = runner.log;

            watch(() => runner.log, (newLogs) => {
                this.$store.dispatch('saveTaskLog', { taskId, log: newLogs });
            }, { deep: true });
        },
        stop(taskId) {
            this.runner.stop();
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
