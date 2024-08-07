REM =======================================
REM 파일명 : CreateProject.bat
REM =======================================
@echo off

REM 코드 페이지를 65001로 변경 (UTF-8)
chcp 65001 >nul

       echo DepartManager 프로젝트 설정 중...

REM =======================================
REM 사용자 입력
REM =======================================
       set PROJECT_DRIVE=C:
       set PROJECT_ROOT=C:\Project\workspacec\common_util\server
       set projectName=server

       REM 데이터베이스 정보
       set DATABASE_HOST=localhost
       set DATABASE_PORT=3306
       set DATABASE_USER=root
       set DATABASE_PASSWORD=^&
       set DATABASE_NAME=DBCommCode
       set DATABASE_MAX=10
       set DATABASE_MIN=0
       set DATABASE_ACQUIRE=30000
       set DATABASE_IDLE=10000
REM =======================================
REM 프로젝트 폴더 생성 및 이동
REM =======================================

       IF NOT EXIST %PROJECT_ROOT% mkdir %PROJECT_ROOT%
       cd /d %PROJECT_ROOT%
REM =======================================
REM Express 프로젝트 생성
REM =======================================
       call npm init -y
       call npm install express express-generator
       call npx express --view=ejs -f
       echo 프로젝트 설정 완료.
REM =======================================
REM npm 모듈 설치
REM =======================================
       
       call npm install morgan sequelize dotenv mysql2 sequelize-cli sequelize-auto cors multer fs path child_process util cookie-parser 
       echo npm 모듈 설치 완료



REM =======================================
REM Sequelize CLI를 사용하여 모델 및 라우터 생성
REM =======================================
       echo 모델 및 라우터 생성 중...

       call npx sequelize-cli init
       
REM =======================================
REM 데이터베이스에서 모델 생성
REM =======================================
       echo 데이터베이스에서 모델 생성 중...

       REM Sequelize Auto를 사용하여 데이터베이스에서 모델 생성
       REM call npx sequelize-auto -o "./models" -d %DATABASE_NAME% -h %DATABASE_HOST% -u %DATABASE_USER% -p %DATABASE_PORT% -x %DATABASE_PASSWORD% -e mysql
       call npx sequelize-auto -o "./models" -d %DATABASE_NAME% -h %DATABASE_HOST% -u %DATABASE_USER% -p %DATABASE_PORT%  -e mysql --force

:end