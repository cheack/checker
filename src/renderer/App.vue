<template>
    <div id="app">
        <Navbar />
        <div class="container">
            <router-view :key="$route.path"/>
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
    @import "~materialize-css/dist/css/materialize.min.css";
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
