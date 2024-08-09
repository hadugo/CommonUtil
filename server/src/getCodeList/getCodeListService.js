
// ===================================================================
// 파일명 : \src\getCodeList\getCodeListService.js
// ===================================================================

const path = require('path');
const PROJECT_ROOT = process.cwd();
const MODEL_PATH = path.join(PROJECT_ROOT, 'models');
const db = require(MODEL_PATH);

const findAll = async function(reqData){

    const Model = {
        'DEPT' : db.tbcommcd,
        'TITL' : db.tbcommcd,
        'EMPT' : db.tbcommcd,
        '' : db.tbcommcd,
    };

    const result = {
        sucess : false,
        error  : '',
        data   : [],
    }
    const {files, svo={}, dvo, value} = reqData
    const {searchDvo={}} = svo
    const {codeType = '', code='', name=''} = searchDvo

    const model = Model[codeType];
    const whereCondition = {};

    if(codeType){
        whereCondition.TYPE = codeType
    }

    if(code){
        whereCondition.DPT_CODE = {
            [db.Sequelize.Op.like]: `%${code}%`
        };
    }

    if(name){
        whereCondition.DPT_NAME = {
            [db.Sequelize.Op.like]: `%${name}%`
        };
    }

    try{
        result.data = await model.findAll({
            attributes: [
                ['CODE', 'code'],
                ['NAME', 'name'],
                [ db.Sequelize.fn('CONCAT', '[ ', db.Sequelize.col('CODE'),  ' ] ', db.Sequelize.col('NAME')), 'codeName'],
            ],
            where: whereCondition,
            raw: true,
            nest: true,

        });
        result.sucess = true
    } catch(error) {
        result.error = error
    }

    return result;
};

module.exports = {
    findAll: findAll,
};