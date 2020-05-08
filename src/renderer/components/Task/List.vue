<template>
    <div>
        <h1>List</h1>

        <hr>

        <ul v-for="item in log">
            <li>{{ item }}</li>
        </ul>
        <div v-for="value in screenshots">
            <img class="screenshot" :src="`data:image/png;base64,${value}`">
        </div>

        <ul v-for="value in values">
            <li>{{ value }}</li>
        </ul>

        <table v-if="tasks.length">
            <thead>
            <tr>
                <th></th>
                <th>Title</th>
                <th>Actions</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(task, idx) of tasks"
                :key="task.id"
            >
                <td>
                    <button class="btn btn-small blue" @click="run(task.id)">
                        <i class="material-icons tooltipped" data-tooltip="Run">play_arrow</i>
                    </button>
                </td>
                <td>{{task.title}}</td>
                <td>{{task.steps.length}}</td>
                <td>
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
    // import M from 'materialize-css'
    import Selenium from '../../Selenium'
    let selenium = new Selenium()

    export default {
        data() {
            return {
                log: selenium.log,
                screenshots: selenium.screenshots,
                values: selenium.values,
            }
        },
        computed: {
            tasks() {
                return this.$store.getters.tasks
            },
        },
        methods: {
            remove(taskId) {
                if (confirm('Are you sure?')) {
                    this.$store.dispatch('deleteTask', taskId)
                }
            },
            run(taskId) {
                const task = this.$store.getters.taskById(taskId)
                selenium.steps = task.steps
                selenium.run()
            }
        },
        mounted() {
            // M.FormSelect.init(this.$refs.select)
        }
    }
</script>

<style lang="scss" scoped>
    .td {
        max-width: 400px;
    }

    .text {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .screenshot {
        max-width: 600px;
    }
</style>