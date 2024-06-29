<template>
    <div>
        <p v-if="runner.running">
            {{ runner.message }}
        </p>

        <p v-if="runner.done && runner.result.length">
            {{ runner.result }}
        </p>

        <div v-if="runner.error" class="alert alert-danger">
            {{ runner.error }}
        </div>

        <a @click="showLog">View Log</a>
        <RunnerLog :log="runner.log" ref="log" />
    </div>
</template>

<script>
import RunnerLog from './RunnerLog.vue';

export default {
    name: 'runner_progress',
    components: { RunnerLog },
    props: ['taskId', 'runner', 'lastLog'],
    computed: {
        log() {
            return {
                task_id: this.taskId,
                log: this.runner.log,
                result: this.runner.result,
                error: this.runner.error,
            };
        }
    },
    methods: {
        showLog() {
            this.$refs.log.show();
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
