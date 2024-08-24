import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import helpComponent from '@/utils/HelpComponent.js';
import commonUtils from '@/utils/CommonUtils.js';

createApp(App)
    .use(store)
    .use(router)
    .use(helpComponent)
    .use(commonUtils)
    .mount('#app');