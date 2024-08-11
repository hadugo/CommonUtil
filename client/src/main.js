import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { helpComponentInit } from '@/utils/HelpComponent.js'; // 중괄호 사용

createApp(App)
    .use(store)
    .use(router)
    .config.globalProperties.$helpComponentInit = helpComponentInit
    .mount('#app');