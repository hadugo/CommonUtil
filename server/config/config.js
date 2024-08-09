
/* ========================================== *
 * /config/config.js
 * ========================================== *
 * npm install dotenv  
 * ========================================== */
require('dotenv').config();
const config = {
  "development": {
      "host": process.env.DATABASE_HOST,
      "username": process.env.DATABASE_USER,
      "password": process.env.DATABASE_PASSWORD, 
      "database": process.env.DATABASE_NAME,
      "dialect": "mysql",
      "pool": {
          "max": parseInt(process.env.DATABASE_MAX),
          "min": parseInt(process.env.DATABASE_MIN),
          "acquire": parseInt(process.env.DATABASE_ACQUIRE),
          "idle": parseInt(process.env.DATABASE_IDLE)
      },
      "use_env_variable": null // 또는 필요한 경우 환경 변수 이름 설정
  }
}
module.exports = config;

