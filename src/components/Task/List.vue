<template>
    <div>
        <h1>List</h1>

        <hr>

        <table v-if="tasks.length" class="table table-bordered">
            <tbody>
                <ListItem v-for="(task, idx) in tasks" :task="task" :key="idx"></ListItem>
            </tbody>
        </table>
        <p v-else>No tasks</p>
    </div>
</template>

<script>
import ListItem from './ListItem.vue';

    export default {
        components: { ListItem },
        computed: {
            tasks() {
                return this.$store.getters.tasks
            }
        },
    };
</script>

<style lang="scss" scoped>

</style>
