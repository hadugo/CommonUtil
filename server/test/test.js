
/* ========================================== *
 * /test/test.js
 * ========================================== */

const path = require('path');
const PROJECT_ROOT = process.cwd();
const MODEL_PATH = path.join(PROJECT_ROOT, 'models');
const db = require(MODEL_PATH)

const SERVICE_PATH = path.join(PROJECT_ROOT, 'src', 'getCodeList','getCodeListService');
const getCodeListService = require(SERVICE_PATH)

const CONTROLLER_PATH = path.join(PROJECT_ROOT, 'src', 'getCodeList','getCodeListController');
const getCodeListController = require(CONTROLLER_PATH)

async function main() {

    /* -------------------------------------- *
     * 모델 테스트 
     * -------------------------------------- */
    {
        console.log(' ----------------------- ');
        console.log(' 모델 테스트 ');
        async function getAll() {
            const rs = await db.tbcommcd.findAll({
                attributes: [
                    ['CODE', 'code'],
                    ['NAME', 'name'],
                    [ db.Sequelize.fn('CONCAT', '[ ', db.Sequelize.col('CODE'),  ' ] ', db.Sequelize.col('NAME')), 'codeName'],
                ],
            });

            const codeList = rs.map(item => item.toJSON())
            const result = JSON.parse(JSON.stringify(codeList));
            return result;
        }

        const data = await getAll();
        console.log(data);
    }

    /* -------------------------------------- *
     * 서비스 테스트 
     *--------------------------------------- */
    {
        console.log(' --------------------------- ');
        console.log(' 서비스 테스트 ');
        const param = {
            svo : {
                searchDvo : {
                    codeType : 'DEPT'
                }
            }
        }
        const data = await getCodeListService.findAll(param)
        console.log(data);
    }

    /* -------------------------------------- *
     * 컨트롤러 테스트 
     *--------------------------------------- */
    {
        console.log(' --------------------------- ');
        console.log(' 컨트롤러 테스트 ');
        const param = {
            svo : {
                searchDvo : {
                    codeType : 'DEPT'
                }
            }
        }
        const data = await getCodeListController[0].method(param)
        console.log(data);
    }
    process.exit();

}

main();