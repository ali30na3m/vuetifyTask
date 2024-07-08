import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './views'
import vuetify from './plugins/vuetify'
import { i18n } from './plugins/i18n'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(vuetify)
app.mount('#app')
