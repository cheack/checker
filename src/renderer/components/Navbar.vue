<template>
  <div class="ui visible left vertical thin sidebar menu inverted">
    <router-link
        to="/create"
        exact
        class="item"
        active-class="active"
    >
      <i class="add layout icon"></i>
      New task
    </router-link>

    <router-link
        to="/"
        exact
        class="item"
        active-class="active"
      >
      <i class="list layout icon"></i>
      All tasks
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>

</style>
