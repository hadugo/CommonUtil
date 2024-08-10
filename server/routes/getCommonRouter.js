

// ===================================================================
// 파일명 : \routers\getCommmonRouter.js
// ===================================================================

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const multer = require('multer');
const { throws } = require('assert');

const PROJECT_ROOT = process.cwd();
const UPLOAD_PATH = path.join(PROJECT_ROOT, 'upload');
if(fs.existsSync(UPLOAD_PATH)){
    fs.mkdirSync(UPLOAD_PATH);
}

const fileFilter = function(req, file, callback){
    if(file.fieldname == 'files' || file.fieldname == "svo"){
        callback(null, true);
    } else {
        callback(null, false);
    }
}
const upload = multer({storage : multer.memoryStorage(), fileFilter : fileFilter}).any();

const getCommonRouter = function(controllerPath){

    const controllerList = require(controllerPath);
    for(const controller of controllerList){

        router.route(controller.url)
            .post(async (req, res, next) => {
                console.log('baseUrl : ', req.baseUrl);
                const result = {
                    sucess : false,
                    error : '',
                    reqData : {},
                    resData : [],
                }

                const PREFIX = moment().format('YYYYMMDDHHmmss');
                try{
                    const uploadResult = await new Promise((resolve, reject)=>{
                        upload(req, res, (error) => {
                            if(error){
                                reject('upload error')
                            }
                            resolve('')
                        });
                    })
                    if(uploadResult){
                        throw new Error('uploadError')
                    }
                    req.files.forEach(
                        file => {
                            if(file.fieldname === 'file'){
                                const encodedFileName = Buffer.from(file.originalname, 'binary').toString('utf-8');
                                const fileName = `${PREFIX}_${encodedFileName}`;
                                const filePath = path.join(UPLOAD_PATH, fileName);
                                fs.writeFileSync(filePath, file.buffer);
                                const fileInfo = {
                                    fieldName : file.fieldname,
                                    srcName : file.originalname,
                                    dstName : fileName,
                                    fileSize : file.size,
                                }
                                if(!result.reqData.files) {
                                    result.reqData.files = []
                                }
                                result.reqData.files.push(fileInfo);
                            } else if(file.fieldname === 'svo'){
                                const svoStr = file.buffer.toString('utf-8');
                                const svo = JSON.parse(svoStr);
                                result.reqData.svo = svo;
                            }
                        }
                    );
                    if(req.body.dvo){
                        const dvoStr = req.body.dvo;
                        const dvo = JSON.parse(dvoStr);
                        result.reqData.dvo = dvoStr;
                    }
    
                    if(req.body.value){
                        const value = req.body.value;
                        result.reqData.value = value;
                    }
                    const data = await controller.method(result.reqData);
                    
                    result.resData = data.data
                    result.error   = data.error;
                    result.sucess  = data.sucess;
                    res.status(200).json(result);
                    return 
                }catch(error){
                    result.error = error.message;
                    res.status(500).json(result);
                    return
                }
            })
            
            .get(async (req, res) => {
                console.log('baseUrl : ', req.baseUrl);
                console.log('params : ', req.params);
                console.log('query : ', req.query);
                const result = {
                    sucess : false,
                    error : null,
                    reqData : null,
                    resData : null,
                }
                // ======================================================
                // Call Conroller
                // ======================================================
                try{
                    const dvo = req.params && Object.keys(req.params).length > 0 ? req.params : req.query;
                    const svo = { searchDvo : dvo }
                    result.reqData = { svo : svo }
                    const data = await controller.method(result.reqData);
                    result.resData = data.resData
                    result.error   = data.error;
                    result.sucess  = data.sucess;
                    res.status(200).json(result);
                    return 
                } catch(error){
                    res.status(500).json(result);
                    return 
                }
            })
            
    }

    return router;
}

module.exports = getCommonRouter;


/*
// ===================================================================
// SAMPLE
// ===================================================================

// ===================================================================
// 파일명 : \src\getCodeList\getCodeListService.js
// ===================================================================

const path = require('path');
const PROJECT_ROOT = process.cwd();
const MODEL_PATH = path.join(PROJECT_ROOT, 'models');
const db = require(MODEL_PATH);

const findAll = async function(reqData){
    ....................
     생략
    ....................
    return result;
};

module.exports = {
    findAll: findAll,
};


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
    { url : "/", method : getCodeList, }
]

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
    } 
]


// ===================================================================
// 파일명 : \app.js
// ===================================================================
var cors = require('cors'); // CORS 패키지 가져오기
const getCommonRouter = require('./routes/getCommonRouter');

/* ------------------------------------------ *
 * controllers 모든 파일을 읽어와 Routing하는 경우
 * ------------------------------------------ *
const controllersDir = path.join(__dirname, 'controllers');
fs.readdirSync(controllersDir).forEach(file => {
  const controller = require(path.join(controllersDir, file));
  const routePath = controller.routePath || `/${path.basename(file, '.js').toLowerCase()}`;
  const router = getCommonRouter(controller);
  app.use(routePath, router);
});
 * ------------------------------------------ */


/* ------------------------------------------ *
 * routes/routerList.js 를 이용하는 경우
 * ------------------------------------------ *
const routerList = require('./routes/routerList'); // routerList.js 가져오기
routerList.forEach(route => {
    const controllerPath = route.controllerPath;
    const router = getCommonRouter(controllerPath); // getCommonRouter를 사용하여 라우터 생성
    app.use(route.url, router); // 라우터를 Express 애플리케이션에 추가
});
/* ------------------------------------------ *


*/