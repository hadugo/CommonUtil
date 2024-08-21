// ===================================================================
// 파일명 : \src\getCodeList\getCodeListController.js
// ===================================================================
const path = require('path');
const PROJECT_ROOT = process.cwd();
const SERVICE_PATH = path.join(PROJECT_ROOT, 'src', 'getCodeList','getCodeListService');
const getCodeListService = require(SERVICE_PATH)

const getCodeList = async function(reqData){
    const result = await getCodeListService.findAll(reqData);
    return result;
    
}

module.exports = [
    { url : "/", method : getCodeList, },
    { url : "/:param", method : getCodeList, }
]