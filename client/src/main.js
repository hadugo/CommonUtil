import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import helpComponentInit from '@/utils/HelpComponent.js';

createApp(App)
    .use(store)
    .use(router)
    .use(helpComponentInit)
    .mount('#app')
