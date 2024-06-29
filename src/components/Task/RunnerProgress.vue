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
    props: ['runner'],
    methods: {
        showLog() {
            this.$refs.log.show();
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
