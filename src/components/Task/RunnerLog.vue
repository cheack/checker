<template>
    <div>
        <div class="modal fade" :id="`modal${modalRef}`" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">Log</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-for="item in log" class="card mb-3">
                            <div class="card-body">
                                {{ item.message }}
                            </div>
                            <div class="card-img">
                                <img v-if="item.screenshot" class="img-fluid" :src="item.screenshot">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as bootstrap from 'bootstrap'
    export default {
        name: 'runner_log',
        props: ['log'],
        data() {
            return {
                ///modalRef: Math.random().toString(36).slice(2)
                modalRef: Math.random().toString(36).slice(2)
            }
        },
        methods: {
            show() {
                const myModal = new bootstrap.Modal(`#modal${this.modalRef}`)
                myModal.show()
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>
