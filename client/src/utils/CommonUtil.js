export default {
    install(app){
        app.config.globalProperties.$commonUtil = {
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