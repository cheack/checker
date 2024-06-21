import { createMemoryHistory, createRouter } from 'vue-router'
import List from '../components/Task/List.vue'
import Task from '../components/Task/Task.vue'

const routes = [
    {
        path: '/',
        name: 'list',
        component: List
    },
    {
        path: '/create',
        name: 'create',
        component: Task
    },
    {
        path: '/task/:id',
        name: 'task',
        component: Task
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
