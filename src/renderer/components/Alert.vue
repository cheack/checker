<template>
    <div class="alert card lighten-4" :class="color">
        <div class="card-content">
            <p>
                <i class="material-icons">{{ icon }}</i>
                <span>
                    {{ message }}<span v-if="info">:</span>
                </span>{{ info }}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'alert',
        props: ['type', 'message', 'info'],
        computed: {
            color() {
                switch (this.type) {
                case 'info': return 'blue blue-text text-darken-3'
                case 'success': return 'green green-text text-darken-4'
                case 'warning': return 'amber brown-text'
                case 'error': return 'red red-text text-darken-4'
                }
            },
            icon() {
                switch (this.type) {
                case 'info': return 'info'
                case 'success': return 'check_circle'
                case 'warning': return 'report_problem'
                case 'error': return 'report'
                }
            }
        }
    }
</script>

<style lang="scss">
    .alert {
        .card-content {
            span {
                font-weight: bold;
                font-size: 1.1em;
                margin-right:4px;
            }
            .material-icons {
                font-size: 1.5em;
                position: relative;
                top: 5px;
                margin-right: 0.5em;
            }
        }
    }
</style>
