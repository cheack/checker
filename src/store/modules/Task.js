function updateStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const state = {
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]')
}

const mutations = {
    saveTaskLog(state, { taskId, log }) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            task.lastLog = log;
            updateStorage(state.tasks);
        }
    },

    storeTask(state, task) {
        if (!task.id) {
            task.id = Date.now()
            state.tasks.push(task)
        } else {
            const index = state.tasks.findIndex(t => t.id === task.id)
            if (index !== -1) {
                state.tasks.splice(index, 1, task)
            } else {
                state.tasks.push(task)
            }
        }
        updateStorage(state.tasks);
    },

    deleteTask(state, taskId) {
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        updateStorage(state.tasks);
    },
}

const actions = {
    saveTaskLog({commit}, log) {
        commit('saveTaskLog', log)
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
