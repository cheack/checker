// import Store from 'electron-store';
// const store = new Store()

const state = {
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]')
    // tasks: store.get('tasks')
}

const mutations = {
    setTaskLog(state, log) {
        const tasks = state.tasks.concat()
        const idx = tasks.findIndex(t => t.id === log.task_id)
        tasks[idx].lastLog = log

        state.tasks = tasks
        store.set('tasks', state.tasks)
    },

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

        // console.log(store.get('tasks'))
        // store.set('tasks', state.tasks)
    },
    deleteTask(state, taskId) {
        const tasks = state.tasks.concat()

        const idx = tasks.findIndex(t => t.id === taskId)
        tasks.splice(idx, 1)
        state.tasks = tasks
        store.set('tasks', state.tasks)
    },
}

const actions = {
    setTaskLog({commit}, log) {
        commit('setTaskLog', log)
    },
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
