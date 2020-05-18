<template>
    <div id="app">
        <Navbar />
        <div class="pusher">
            <div class="ui container">
            <router-view :key="$route.path"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Navbar from './components/Navbar'
    export default {
        name: 'checker',
        components: {Navbar}
    }
</script>

<style lang="scss">
    @import "~fomantic-ui/dist/semantic.min.css";

    .sidebar.visible + .pusher {
        width: calc(100% - 150px);
    }
</style>
