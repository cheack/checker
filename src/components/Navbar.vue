<template>
    <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Checker</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link
                            to="/"
                            exact
                            class="nav-link"
                            active-class="active"
                        >
                            <i class="bi bi-list"></i>
                            All tasks
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link
                            to="/create"
                            exact
                            class="nav-link"
                            active-class="active"
                        >
                            <i class="bi bi-plus-lg"></i>
                            New task
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>

</style>
