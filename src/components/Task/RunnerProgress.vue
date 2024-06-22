<template>
    <div>
        <p v-if="runner.running">
            {{ runner.message }}
        </p>

        <p v-if="runner.done && runner.result.length">
            {{ runner.result }}
        </p>

        <p v-if="runner.error">
            {{ runner.error }}
        </p>

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
