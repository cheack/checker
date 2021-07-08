<template>
    <div>
        <div class="ui longer modal" :id="`modal${modalRef}`">
            <i class="close icon"></i>
            <div class="header">
                Log
            </div>
            <div class="scrolling content">
                <div v-for="item in log.log"  class="ui card fluid">
                    <div class="content">
                        {{ item.message }}
                    </div>
                    <div class="image">
                        <img v-if="item.screenshot" class="screenshot" :src="`data:image/png;base64,${item.screenshot}`">
                    </div>
                </div>
            </div>
            <div class="actions">
                <div class="ui deny button">Close</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'runner_log',
        props: ['log'],
        data() {
            return {
                modalRef: Math.random().toString(36).slice(2)
            }
        },
        methods: {
            show() {
                $(`#modal${this.modalRef}`).modal('show')
            },
        },
    }
</script>

<style lang="scss" scoped>
    
</style>
