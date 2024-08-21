
import axios from 'axios'
export default {
    install(app){

        const helpComponent =  {

            initial : async function(args) {

                /*
                args = {
                    codeList,        // 코드리스트
                    postUrl,         // 코드리스트 조회 URL
                    inputObjs : {
                        edCode,      // 코드 입력 테그 객체
                        edName,      // 이름 입력 테그 객체
                        edCodeName,  // "[ 코드 ] 이름" 테그 객체
                        btnSrch      // 조회버튼 객체
                    }, 
                    popupObjs : {
                        popup,       // dialog테그 객체
                        grid,        // 그리드 객체
                        btnClose,    // 팝업창의 우측 상단 [x] 버튼 객체
                        btnOk,       // 팝업창의 [선택]버튼 객체
                        btnCancel    // 팝업창의 [취소]버튼 객채
                    }, 
                    callback,        // 코드 선택 후 처리할 함수
                }
                */

                // //////////////////////////////////////////////////////////////
                //
                // 각종 함수 선언
                //
                // //////////////////////////////////////////////////////////////

                let codeList = null
                
                let getCodeList = async function(){
                    let codeList = null
                    if(args.codeList){
                        return args.codeList
                    }
                    const formData = new FormData()
                    const svo = {
                        searchDvo : args.postParam,
                    }
                    const svoStr = JSON.stringify(svo)
                    formData.append('svo', new Blob([svoStr], {type : 'application/json'}), 'svo')
                    try{
                        const response = await axios.get(args.postUrl)
                        codeList = response.data.resData
                    } catch(error){
                        console.log(error)
                        return null // 오류 발
                    }
                    return codeList
                }

                // ..............................................................
                // 팝업창에서 사용할 각종 이벤트 함수 선언
                // ..............................................................
                const popupEvents = {
                    onSelected : (param /* {btn, data={code, name, codeName}} */) => {
                        if(args.popupObjs.popup.open){
                            args.popupObjs.popup.close()
                        }
                        
                        if(param.btn == "ok")  {
                            args.inputObjs.edCode.value = param.data.code
                            args.inputObjs.edName.value = param.data.name
                            args.inputObjs.edCodeName.value = param.data.codeName
                        }
                        if(args.callback){
                            args.callback(param, args)
                        }
                    },
                    rowDblClick : (event) => {
                        popupEvents.clearEvents()
                        const result = {
                            btn : "ok",
                            data : event.data,
                        }
                        popupEvents.onSelected(result)
                    },
                    
                    onBtnCloseClick : ()=>{
                        popupEvents.clearEvents()
                        const result = {
                            btn  : "close",
                            data : {
                                code : '',
                                name : '',
                                codeName : '',
                            },
                            callback : args.callback
                        }
                        popupEvents.onSelected(result)
                    },

                    onBtnCancelClick : ()=>{
                        popupEvents.clearEvents()
                        const result = {
                            btn  : "cancel",
                            data : {
                                code : '',
                                name : '',
                                codeName : '',
                            },
                            callback : args.callback
                        }
                        popupEvents.onSelected(result)
                    },
                    
                    onBtnOkClick : ()=>{
                        popupEvents.clearEvents()
                        const result = {
                            btn  : "ok",
                            data : {
                                code : "",
                                name : "",
                                codeName : "",
                            },
                        }
                        const selectedDatas = args.popupObjs.grid.api.getSelectedRows()
                        if(selectedDatas.length > 0){
                            result.data = selectedDatas[0]
                        }
                        popupEvents.onSelected(result)
                    },
                    
                    clearEvents : ()=>{
                        args.popupObjs.btnClose.removeEventListener('click', popupEvents.onBtnCloseClick)
                        args.popupObjs.btnCancel.removeEventListener('click', popupEvents.onBtnCancelClick)
                        args.popupObjs.btnOk.removeEventListener('click', popupEvents.onBtnOkClick)
                        args.popupObjs.grid.api.removeEventListener('rowDoubleClicked' , popupEvents.rowDblClick)
                    },

                }

                // ..............................................................
                // 팝업창에서 사용할 그리드 생성 함수 선언
                // ..............................................................
                const createGrid = function(filteredCodeList){
                    const columnDefs=[
                        { field: 'idx'      , flex: 1},
                        { field: 'code'     , flex: 1},
                        { field: 'name'     , flex: 1},
                        { field: 'codeName' , flex: 2},
                    ]
                    args.popupObjs.grid.$el.className = ''
                    args.popupObjs.grid.$el.classList.add('ag-theme-quartz')
                    args.popupObjs.grid.api.setGridOption("rowSelection", 'single')
                    args.popupObjs.grid.api.setGridOption("columnDefs", columnDefs)
                    args.popupObjs.grid.api.setGridOption("rowData",  JSON.parse(JSON.stringify(filteredCodeList)))
                    args.popupObjs.grid.api.addEventListener('rowDoubleClicked', popupEvents.rowDblClick)
                }
                // ..............................................................
                // 팝업창에 사용할 코드 목록 필터링 함수 선언
                // ..............................................................
                const findCode = async (param /* {code, name, codeName, codeList} */ )=>{
                    if(!codeList) return []
                    if(codeList.length == 0) return []
                    const paramCode     = param.code      ? param.code.toUpperCase()      : ''
                    const paramName     = param.name      ? param.code.toUpperCase()      : ''
                    const paramCodeName = param.codeName  ? param.code.toUpperCase()  : ''
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
                    
                    
                    // --------------------------------------------------------------
                    // 코드 조회 함수 선언 - 조건에 맞는 코드가 없으면 모든 코드 목록
                    // --------------------------------------------------------------
                    if(filteredCodeList.length == 0){
                        filteredCodeList = JSON.parse(JSON.stringify(param.codeList))
                    }

                    filteredCodeList.forEach((item, index) => {
                        item.idx = index; // 원본 배열의 각 항목에 idx 속성 추가
                    });

                    return filteredCodeList;
                    
                }

                // ..............................................................
                // 팝업창을 열기 위한 함수 선언
                // ..............................................................
                const showModal = function(filteredCodeList){
                    if(!filteredCodeList) return
                    if(filteredCodeList.length == 0) return
                    // --------------------------------------------------------------
                    // 코드 조회 함수 선언 - 팝업창 OPEN
                    // --------------------------------------------------------------
                    args.popupObjs.popup.showModal()
                    createGrid(filteredCodeList);
                    // --------------------------------------------------------------
                    // 코드 조회 함수 선언 - 팝업창에서 사용할 이벤트 설정
                    // --------------------------------------------------------------
                    // Close Button Click Event
                    if(args.popupObjs.btnClose){
                        args.popupObjs.btnClose.addEventListener('click', popupEvents.onBtnCloseClick)
                    }

                    // Cancel Button Click Event
                    if(args.popupObjs.btnCancel){
                        args.popupObjs.btnCancel.addEventListener('click', popupEvents.onBtnCancelClick)
                    }

                    // Ok Button Click Event
                    if(args.popupObjs.btnOk){
                        args.popupObjs.btnOk.addEventListener('click', popupEvents.onBtnOkClick)
                    }
                }


                // //////////////////////////////////////////////////////////////
                //
                // [  코드, 이름, 조회버튼 초기화 시작 ]
                //
                // 1. 코드 목록을 가져와 초기값으로 저장한다.
                // 2. 코드, 이름, 조회버튼의 이벤트를 정의한다.
                //
                // //////////////////////////////////////////////////////////////

                codeList = await getCodeList()

                // ==============================================================
                // edCode 이벤트 정의
                // ==============================================================
                args.inputObjs.edCode.addEventListener('focus', function(event) {
                    event.target.select(); // 포커스 시 텍스트 선택
                })

                args.inputObjs.edCode.addEventListener("keyup", async (event)=>{
                    args.inputObjs.edName.value = ''
                    args.inputObjs.edCodeName.value = ''

                    if(event.key != 'Enter' && event.target.value.length < 4){
                        return
                    }
                    
                    const param = {
                        code    : args.inputObjs.edCode.value, 
                        name    : args.inputObjs.edCode.edName, 
                        codeName: args.inputObjs.edCode.edCodeName,
                        codeList  : JSON.parse(JSON.stringify(codeList)), 
                    } 
                    const filteredCodeList = await findCode(param)
                    if(filteredCodeList.length == 0){
                        args.inputObjs.edCode.value = ''
                        args.inputObjs.edName.value = ''
                        args.inputObjs.edCodeName.value = ''
                    } else if(filteredCodeList.length == 1){
                        const result = {
                            btn : "",
                            data : {
                                code    : filteredCodeList[0].code,
                                name    : filteredCodeList[0].name,
                                codeName: filteredCodeList[0].codeName,
                            }
                        }
                        popupEvents.onSelected(result)
                        return result
                    }
                    showModal(filteredCodeList)
                })

                // ==============================================================
                // edName 이벤트 정의
                // ==============================================================
                args.inputObjs.edName.addEventListener('focus', function(event) {
                    event.target.select(); // 포커스 시 텍스트 선택
                })

                args.inputObjs.edName.addEventListener("keyup", async (event)=>{
                    args.inputObjs.edCode.value = ''
                    args.inputObjs.edCodeName.value = ''

                    if(event.key != 'Enter'){
                        return
                    }
                    const param = {
                        edCode    : args.inputObjs.edCode.value, 
                        edName    : args.inputObjs.edCode.edName, 
                        edCodeName: args.inputObjs.edCode.edCodeName,
                        codeList  : JSON.parse(JSON.stringify(codeList)), 
                    } 
                    const filteredCodeList = await findCode(param)
                    if(filteredCodeList.length == 0){
                        args.inputObjs.edCode.value = ''
                        args.inputObjs.edName.value = ''
                        args.inputObjs.edCodeName.value = ''
                    } else if(filteredCodeList.length == 1){
                        const result = {
                            btn : "",
                            data : {
                                code    : filteredCodeList[0].code,
                                name    : filteredCodeList[0].name,
                                codeName: filteredCodeList[0].codeName,
                            }
                        }
                        popupEvents.onSelected(result)
                        return result
                    }
                    showModal(filteredCodeList)
                })

                // ==============================================================
                // edCodeName 이벤트 정의
                // ==============================================================
                args.inputObjs.edCodeName.addEventListener('focus', function(event) {
                    event.target.select(); // 포커스 시 텍스트 선택
                })

                args.inputObjs.edCodeName.addEventListener("keyup", async (event)=>{
                    args.inputObjs.edCode.value = ''
                    args.inputObjs.edName.value = ''

                    if(event.key != 'Enter'){
                        return
                    }
                    
                    const param = {
                        code    : args.inputObjs.edCode.value, 
                        name    : args.inputObjs.edCode.edName, 
                        codeName: args.inputObjs.edCode.edCodeName,
                        codeList: JSON.parse(JSON.stringify(codeList)), 
                    } 
                    const filteredCodeList = await findCode(param)
                    
                    if(filteredCodeList.length == 0){
                        args.inputObjs.edCode.value = ''
                        args.inputObjs.edName.value = ''
                        args.inputObjs.edCodeName.value = ''
                    } else if(filteredCodeList.length == 1){
                        const result = {
                            btn : "",
                            data : {
                                code    : filteredCodeList[0].code,
                                name    : filteredCodeList[0].name,
                                codeName: filteredCodeList[0].codeName,
                            }
                        }
                        popupEvents.onSelected(result)
                        return result
                    }
                    showModal(filteredCodeList)
                })

                // ==============================================================
                // btnSech
                // ==============================================================
                args.inputObjs.btnSrch.addEventListener("click", async ()=>{
                    args.inputObjs.edCode.value = ''
                    args.inputObjs.edName.value = ''
                    args.inputObjs.edCodeName.value = ''
                    const param = {
                        code    : args.inputObjs.edCode.value, 
                        name    : args.inputObjs.edCode.edName, 
                        codeName: args.inputObjs.edCode.edCodeName,
                        codeList: JSON.parse(JSON.stringify(codeList)), 
                    } 
                    const filteredCodeList = await findCode(param)
                    
                    if(filteredCodeList.length == 0){
                        args.inputObjs.edCode.value = ''
                        args.inputObjs.edName.value = ''
                        args.inputObjs.edCodeName.value = ''
                    } else if(filteredCodeList.length == 1){
                        const result = {
                            btn : "",
                            data : {
                                code    : filteredCodeList[0].code,
                                name    : filteredCodeList[0].name,
                                codeName: filteredCodeList[0].codeName,
                            }
                        }
                        popupEvents.onSelected(result)
                        return result
                    }
                    showModal(filteredCodeList)
                })
            }
        }

        app.config.globalProperties.$helpComponent = helpComponent
        
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
import helpComponent from '@/utils/HelpComponent.js'; // 추가

createApp(App)
    .use(store)
    .use(router)
    .use(helpComponent) // 추가
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
    param = {
      codeList  : null,
      postUrl : 'http://localhost:3000/getCodeList/DEPT', // 코드 조회를 위한 URL
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
    this.$helpComponent.initial(param)
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