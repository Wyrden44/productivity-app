import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createPinia } from 'pinia'
import { syncAllUnsynced } from './sync/sync.service'

const pinia = createPinia()
const app = createApp(App)

function triggerSync() {
    if (navigator.onLine) {
        syncAllUnsynced()
    }
}

window.addEventListener('online', triggerSync)

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) triggerSync()
})

triggerSync()

app.use(pinia)
app.mount('#app')
