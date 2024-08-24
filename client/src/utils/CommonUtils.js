export default {
    install(app){
        app.config.globalProperties.$commonUtils = {
            isNull : function(value){
                if(!value) return true
                if(Array.isArray(value) && !value.length) return true
                if((typeof value).toUpperCase() === 'object'.toUpperCase() && !Object.keys(value).length) return true
                return false
            },
            isNvl : function(value, replacer){
                const result = this.isNull(value) ? replacer : value
                return result
            },
        }
    }
}
/* ========================================================================== *
/* SAMPLE CODE 
/* ========================================================================== *


// --------------------------------------------------------------------------
//  main.js
// --------------------------------------------------------------------------
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import commonUtil from '@/utils/CommonUtils.js'; // 추가

createApp(App)
    .use(store)
    .use(router)
    .use(commonUtils) // 추가
    .mount('#app')
 * ========================================================================== */

