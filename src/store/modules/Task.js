const state = {
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]')
}

const mutations = {
    storeTask(state, task) {
        if (!task.id) {
            task.id = Date.now()
            state.tasks.push(task)
        } else {
            const tasks = state.tasks.concat()

            const idx = tasks.findIndex(t => t.id === task.id)
            tasks[idx] = task

            state.tasks = tasks
        }

        localStorage.setItem('tasks', JSON.stringify(state.tasks))
    },
    deleteTask(state, taskId) {
        const tasks = state.tasks.concat()

        const idx = tasks.findIndex(t => t.id === taskId)
        tasks.splice(idx, 1)
        state.tasks = tasks
        localStorage.setItem('tasks', JSON.stringify(state.tasks))
    },
}

const actions = {
    storeTask({commit}, task) {
        commit('storeTask', task)
    },
    deleteTask({commit}, taskId) {
        commit('deleteTask', taskId)
    },
}

export const config = {
    state,
    mutations,
    actions,
    getters: {
        tasks: s => s.tasks,
        taskById: s => id => s.tasks.find(t => t.id === id)
    },
}
