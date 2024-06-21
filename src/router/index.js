import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'list',
            component: require('@/components/Task/List').default
        },
        {
            path: '/create',
            name: 'create',
            component: require('@/components/Task/Task').default
        },
        {
            path: '/task/:id',
            name: 'task',
            component: require('@/components/Task/Task').default
        },
        {
            path: '*',
            redirect: '/'
        },
    ]
})
