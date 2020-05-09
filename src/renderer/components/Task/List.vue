<template>
    <div>
        <h1>List</h1>

        <hr>

        <table v-if="tasks.length">
            <tbody>
            <tr
                v-for="(task, idx) of tasks"
                :key="task.id"
            >
                <td>
                    <div v-if="task.runner && task.runner.running" class="loader"></div>
                    <button v-else class="btn btn-small blue run" @click="run(task.id)">
                        <i class="material-icons tooltipped" data-tooltip="Run">play_arrow</i>
                    </button>

                    {{task.title}}

                    <div v-if="task.runner">
                        <p v-if="task.runner.running && task.runner.log.length">
                            {{ task.runner.log[task.runner.log.length - 1].message }}
                        </p>

                        <p v-if="task.runner.done && task.runner.result.length">
                            {{ task.runner.result }}
                        </p>

                        <p v-if="task.runner.error">
                            {{ task.runner.error }}
                        </p>

                        <a @click="showLog(task.id)" class="waves-effect waves-light btn" >View Log</a>
                        <div :id="`#modal${task.id}`" class="modal modal-fixed-footer">
                            <div class="modal-content">
                                <h4>Log</h4>

                                <div v-for="item in task.runner.log" class="col s12 m7">
                                    <div class="card">
                                        <div class="card-content">
                                            <p>{{ item.message }}</p>
                                        </div>
                                        <div class="card-image">
                                            <img v-if="item.screenshot" class="screenshot" :src="`data:image/png;base64,${item.screenshot}`">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
                            </div>
                        </div>
                    </div>
                </td>
                <td style="width: 20%">
                    <router-link tag="button" class="btn btn-small" :to="'/task/' + task.id">
                        Edit
                    </router-link>
                    <button class="btn btn-small red" @click="remove(task.id)">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
        <p v-else>No tasks</p>
    </div>
</template>

<script>
    import M from 'materialize-css'
    import Selenium from '../../Selenium'

    export default {
        data() {
            return {
                tasks: this.$store.getters.tasks,
            }
        },
        methods: {
            remove(taskId) {
                if (confirm('Are you sure?')) {
                    this.$store.dispatch('deleteTask', taskId)
                }
            },
            showLog(taskId) {
                if (this.modal) {
                    this.modal.destroy()
                }
                this.modal = M.Modal.init(document.getElementById(`#modal${taskId}`))
                this.modal.open()
            },
            run(taskId) {
                let tasks = this.tasks.concat()
                const idx = tasks.findIndex(t => t.id === taskId)
                const task = tasks[idx]
                task.runner = new Selenium()
                task.runner.steps = task.steps
                task.runner.run()
                tasks[idx] = task
                this.tasks = tasks
                this.updateStatus(taskId)
            },
            updateStatus(taskId) {
                this.tasks = this.tasks.concat()
                setTimeout(() => {
                    this.updateStatus(taskId)
                }, 300)
            }
        },
        mounted() {
            // M.FormSelect.init(this.$refs.select)
        }
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

    .run {
        padding: 0 7px;
    }

    .loader {
        border: 5px solid #f3f3f3; /* Light grey */
        border-top: 5px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 32px;
        height: 32px;
        animation: spin 2s linear infinite;
        display: inline-block;
        vertical-align: middle;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>