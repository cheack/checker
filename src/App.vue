<template>
    <div>
        <Navbar />
        <div class="d-flex flex-column">
            <div class="container my-4">
                <router-view :key="$route.path"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Navbar from "./components/Navbar.vue";
    export default {
        name: 'checker',
        components: {Navbar}
    }
</script>

<style lang="scss">
    .sidebar.visible + .pusher {
        width: calc(100% - 150px);
    }

    a {
        -webkit-user-select: none;
        -webkit-user-drag: none;
        -webkit-app-region: no-drag;
    }

    a, a:hover {
        text-decoration: none;
        color: inherit;
        outline: 0;
        cursor:pointer
    }
</style>
