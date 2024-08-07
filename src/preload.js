import { contextBridge, ipcRenderer } from 'electron'
// Expose ipcRenderer to the client
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data)
    },
    on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
})
