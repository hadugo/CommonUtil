
// ===================================================================
// 파일명 : \routes\routerList.js
// ===================================================================
const path = require('path');
const PROJECT_ROOT = process.cwd();

module.exports = [
    {
        // body : { 
        //     svo : {
        //         searchDvo : {
        //             codeKind : 'DPT', 
        //             code:'01', 
        //             name:'ma'
        //         },
        //     }, 
        // }
        url : "/getCodeList",
        controllerPath : path.join(PROJECT_ROOT, 'src', 'getCodeList', 'getCodeListController'),
    } ,
    
    {
        url : "/getCodeList/:param",
        controllerPath : path.join(PROJECT_ROOT, 'src', 'getCodeList', 'getCodeListController'),
    } 
]

