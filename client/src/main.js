import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import helpComponent from '@/utils/HelpComponent.js';
import commonUtil from '@/utils/CommonUtil.js';

createApp(App)
    .use(store)
    .use(router)
    .use(helpComponent)
    .use(commonUtil)
    .mount('#app');