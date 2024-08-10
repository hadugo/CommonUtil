
import axios from 'axios'

export default {
    install(Vue) {
        // vuejs2에서
        // Vue.prototype.$helpComponentInit = async function(param) {
        // vuejs3에서
        Vue.config.globalProperties.$helpComponentInit = async function(param) {
            
            // --------------------------------------------------------------
            // 파라미터 준비
            // --------------------------------------------------------------
            const {codeType, callback, inputObjs, popupObjs} = param
            const {edCode, edName, edCodeName, btnSrch} = inputObjs
            const {popup, popupTitle, grid, btnClose, btnOk, btnCancel} = popupObjs
            let codeList = param.codeList

            // --------------------------------------------------------------
            // 코드 조회 함수 선언
            // --------------------------------------------------------------
            const findCode = async (param)=>{

                const {codeType, edCode, edName, edCodeName, codeList} = param

                const codeTypeName = {
                    'DEPT' : '부서코드',
                    'TITL' : '직급코드',
                    'EMPT' : '사원코드',
                }

                const paramCode     = edCode.value      ? edCode.value.toUpperCase()      : ''
                const paramName     = edName.value      ? edName.value.toUpperCase()      : ''
                const paramCodeName = edCodeName.value  ? edCodeName.value.toUpperCase()  : ''
                let result = {
                    code      : '',
                    name      : '',
                    codeName  : '',
                }
                
                // --------------------------------------------------------------
                // 코드 조회 함수 선언 - 최종 결과를 돌려주는 공통함수 선언
                // --------------------------------------------------------------
                const onSelected = (param) => {

                    if(popup.open){
                        popup.close()
                    }
                    
                    const {btn, data} = param
                    if(btn == "ok")  {
                        edCode.value = data.code
                        edName.value = data.name
                        edCodeName.value = data.codeName
                    }
                    if(callback){
                        callback(param)
                    }
                    
                    return param
                }
                
                // --------------------------------------------------------------
                // 코드 조회 함수 선언 - 코드목록에서 조건에 맞는 코드를 검사하여 목록 재구성
                // --------------------------------------------------------------
                let filteredCodeList = codeList.filter(
                    (ele) => {
                        const eleCode     = ele.code      ? ele.code.toUpperCase()      : ''
                        const eleName     = ele.name      ? ele.name.toUpperCase()      : ''
                        const eleCodeName = ele.codeName  ? ele.codeName.toUpperCase()  : ''
                        if(paramCode){
                            const idx = eleCode.indexOf(paramCode)
                            const result = idx >= 0
                            return result
                        }
                        if(paramName){
                            const idx = eleName.indexOf(paramName)
                            const result = idx >= 0
                            return result
                        }
                        if(paramCodeName){
                            const idx = eleCodeName.indexOf(paramCodeName)
                            const result = idx >= 0
                            return result
                        }
                    }
                )
                if(filteredCodeList.length == 0){
                    filteredCodeList = JSON.parse(JSON.stringify(codeList))
                }
                
                // --------------------------------------------------------------
                // 코드 조회 함수 선언 - 조건에 맞는 코드가 1개이면 출력 후 끝
                // --------------------------------------------------------------
                if(filteredCodeList.length == 1){
                    result = {
                        btn : "ok",
                        data : {
                            code    : filteredCodeList[0].code,
                            name    : filteredCodeList[0].name,
                            codeName: filteredCodeList[0].codeName,
                        }
                    }
                    onSelected(result)
                    return result
                }

                filteredCodeList.forEach((item, index) => {
                    item.idx = index; // 원본 배열의 각 항목에 idx 속성 추가
                });

                // --------------------------------------------------------------
                // 코드 조회 함수 선언 - 조건에 맞는 코드가 여러개이면 그리드에 목록 출력
                // --------------------------------------------------------------
                const columnDefs=[
                    { field: 'idx'      , flex: 1},
                    { field: 'code'     , flex: 1},
                    { field: 'name'     , flex: 1},
                    { field: 'codeName' , flex: 2},
                ]
                grid.$el.className = ''
                grid.$el.classList.add('ag-theme-quartz')
                grid.api.setGridOption("rowSelection", 'single')
                grid.api.setGridOption("columnDefs", columnDefs)
                grid.api.setGridOption("rowData", filteredCodeList)
                

                // --------------------------------------------------------------
                // 코드 조회 함수 선언 - 팝업창에서 사용할 각종 이벤트 함수 선언
                // --------------------------------------------------------------
                const removeEvent = ()=>{
                    btnClose.removeEventListener('click', onBtnCloseClick)
                    btnCancel.removeEventListener('click', onBtnCancelClick)
                    btnOk.removeEventListener('click', onBtnOkClick)
                    grid.api.removeEventListener('rowDoubleClicked' , rowDblClick)
                }

                // grid double click event
                const rowDblClick = (event) => {
                    result = {
                        btn : "ok",
                        data : event.data
                    }
                    onSelected(result)
                    removeEvent()
                }
                const onBtnCloseClick = ()=>{
                    result = {
                        btn  : "close",
                        data : {
                            code : '',
                            name : '',
                            codeName : '',
                        }
                    }
                    onSelected(result)
                    removeEvent()
                }

                const onBtnCancelClick = ()=>{
                    result = {
                        btn  : "cancel",
                        data : {
                            code : '',
                            name : '',
                            codeName : '',
                        }
                    }
                    onSelected(result)
                    removeEvent()
                }
                
                const onBtnOkClick = ()=>{
                    result = {
                        btn  : "ok",
                        data : {
                            code : "",
                            name : "",
                            codeName : "",
                        }
                    }
                    const selectedDatas = grid.api.getSelectedRows()
                    if(selectedDatas.length > 0){
                        result.data = selectedDatas[0]
                    }
                    onSelected(result)
                    removeEvent()
                }

                // --------------------------------------------------------------
                // 코드 조회 함수 선언 - 팝업창에서 사용할 이벤트 설정
                // --------------------------------------------------------------
                grid.api.addEventListener('rowDoubleClicked', rowDblClick)
                // Close Button Click Event
                if(btnClose){
                    btnClose.addEventListener('click', onBtnCloseClick)
                }

                // Cancel Button Click Event
                if(btnCancel){
                    btnCancel.addEventListener('click', onBtnCancelClick)
                }

                // Ok Button Click Event
                if(btnOk){
                    btnOk.addEventListener('click', onBtnOkClick)
                }

                // --------------------------------------------------------------
                // 코드 조회 함수 선언 - 팝업창 OPEN
                // --------------------------------------------------------------
                popupTitle.textContent  = codeTypeName[codeType]
                popup.showModal()

            }

            // --------------------------------------------------------------
            // 코드목록 준비
            // --------------------------------------------------------------
            if(!codeList){
                const formData = new FormData()
                const svo = {
                    searchDvo : {
                        codeType : codeType
                    }
                }
                const svoStr = JSON.stringify(svo)
                formData.append('svo', new Blob([svoStr], {type : 'application/json'}), 'svo')
                const URL = 'http://localhost:3000/getCodeList'
                try{
                    const response = await axios.post(URL, formData)
                    codeList = response.data.resData
                } catch(error){
                    console.log(error)
                }
            }
            // --------------------------------------------------------------
            // 메인창의 이벤트 정의
            // --------------------------------------------------------------
            // edCode
            edCode.addEventListener('focus', function(event) {
                event.target.select(); // 포커스 시 텍스트 선택
            })

            edCode.addEventListener("keyup", (event)=>{
                edName.value = ''
                edCodeName.value = ''

                if(event.key != 'Enter' && event.target.value.length < 4){
                    return
                }
                
                const param = {
                    codeType  : codeType,
                    edCode    : edCode, 
                    edName    : edName, 
                    edCodeName: edCodeName,
                    codeList  : JSON.parse(JSON.stringify(codeList)), 
                } 
                findCode(param)
            })

            // edName
            edName.addEventListener('focus', function(event) {
                event.target.select(); // 포커스 시 텍스트 선택
            })

            edName.addEventListener("keyup", (event)=>{
                edCode.value = ''
                edCodeName.value = ''

                if(event.key != 'Enter'){
                    return
                }
                const param = {
                    codeType  : codeType,
                    edCode    : edCode, 
                    edName    : edName, 
                    edCodeName: edCodeName,
                    codeList  : JSON.parse(JSON.stringify(codeList)), 
                } 
                findCode(param)
            })

            // edCodeName
            edCodeName.addEventListener('focus', function(event) {
                event.target.select(); // 포커스 시 텍스트 선택
            })

            edCodeName.addEventListener("keyup", (event)=>{
                edCode.value = ''
                edName.value = ''

                if(event.key != 'Enter'){
                    return
                }
                
                const param = {
                    codeType  : codeType,
                    edCode    : edCode, 
                    edName    : edName, 
                    edCodeName: edCodeName,
                    codeList  : JSON.parse(JSON.stringify(codeList)), 
                } 
                
                findCode(param)
            })

            // btnSech
            btnSrch.addEventListener("click", ()=>{
                edCode.value = ''
                edName.value = ''
                edCodeName.value = ''
                const param = {
                    codeType  : codeType,
                    edCode    : edCode, 
                    edName    : edName, 
                    edCodeName: edCodeName,
                    codeList  : JSON.parse(JSON.stringify(codeList)), 
                } 
                findCode(param)
            })
        }
    }
}

/* ========================================================================== *
/* SAMPLE CODE 
/* ========================================================================== *


// -------------------------------- main.js ---------------------------------
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import helpComponentInit from '@/utils/HelpComponent.js'; // 추가

createApp(App)
    .use(store)
    .use(router)
    .use(helpComponentInit) // 추가
    .mount('#app')

// ---------------------------------- view ----------------------------------
<template>
  <div>
    
    <div>
      <input ref="edTitlCodeRef" type="hidden">
      <input ref="edTitlNameRef" type="hidden">
      <input ref="edTitlCodeNameRef">
      <button ref="btnTitlSrchRef">...</button>
    </div>

    <dialog class="modal" ref="codeHelpDialog">
      <div class="systemMenu">
        <span ref="btnClose" class="btnClose">x</span>
      </div>
      <h4 ref="titleCodeHelpDialog" class="title"></h4>
      <ag-grid-vue
        ref="grdCodeHelpDialog"
        style="height: 500px"
      />
      <div class="buttonGroup">
        <button ref="btnOk">확인</button>
        <button ref="btnCancel">취소</button>
      </div>
    </dialog>

  </div>
</template>


<script>

import { AgGridVue } from "ag-grid-vue3"; // Ag-Grid API


export default {

  
  name: 'HelpComponentDemoView',

  components: {
    AgGridVue, // Add Vue Data Grid component
  },

  data : function() {
    return {
    }
  },

  mounted : function() {
    const param = {
      codeType  : 'DEPT', 
      codeList  : null,
      inputObjs : {
        edCode    : this.$refs.edDeptCodeRef, 
        edName    : this.$refs.edDeptNameRef, 
        edCodeName: this.$refs.edDeptCodeNameRef,
        btnSrch   : this.$refs.btnDeptSrchRef, 
      },
      popupObjs   : {
        popup     : this.$refs.codeHelpDialog,
        popupTitle: this.$refs.titleCodeHelpDialog,
        grid      : this.$refs.grdCodeHelpDialog,
        btnOk     : this.$refs.btnOk,
        btnCancel : this.$refs.btnCancel,
        btnClose  : this.$refs.btnClose,
      },
      callback  : (param)=>{
        const {btn, data} = param
        const {code, name, codeName} = data
        alert(`${btn}\n${code} : ${name}\n${codeName}`)
      },

    }
    this.$helpComponentInit(param)
  },
}
</script>

<style lang="scss" scoped>

  @import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
  @import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

  .modal {
      background: antiquewhite;
      border-radius: 10px;
      width: 400px;
      padding: 0px 10px 10px 10px;
      margin: 100px auto;
  }

  .modal .systemMenu {
      text-align: right;
      margin: 0 0 0 0;
  }

  .modal .systemMenu .btnClose {
      cursor: pointer;
  }

  .modal .title {
      text-align: center;
      margin: 0px 0px 20px 0px;
      padding: 0px 10px 0px 10px;
  }

  .modal .buttonGroup {
      text-align: center;
      padding: 20px 0px 10px 0px;
  }
</style>
/* ========================================================================== */