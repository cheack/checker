<template>
    <div>
        <p v-if="runner.running">
            {{ runner.message }}
        </p>

        <p v-if="runner.done && runner.result.length">
            {{ runner.result }}
            <a @click="showLog(taskId)">View Log</a>
        </p>

        <p v-if="runner.error">
            {{ runner.error }}
        </p>

        <div class="ui modal" :id="`modal${taskId}`">
            <i class="close icon"></i>
            <div class="header">
                Log
            </div>
            <div class="content">
                <div v-for="item in runner.log"  class="ui card fluid">
                    <div class="content">
                        {{ item.message }}
                    </div>
                    <div class="image">
                        <img v-if="item.screenshot" class="screenshot" :src="`data:image/png;base64,${item.screenshot}`">
                    </div>
                </div>
            </div>
            <div class="actions">
                <div class="ui button">Cancel</div>
                <div class="ui button">OK</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'runner_log',
        props: ['taskId', 'runner'],
        methods: {
            showLog(taskId) {
                $(`#modal${taskId}`).modal('show')
            },
        },
    }
</script>

<style lang="scss" scoped>
    
</style>