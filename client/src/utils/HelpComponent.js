
import axios from 'axios'
// npm install tabulator-tables
import {TabulatorFull as Tabulator} from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator.css'
/*
import 'tabulator-tables/dist/css/tabulator_bootstrap3.css'
import 'tabulator-tables/dist/css/tabulator_bootstrap3.min.css'
import 'tabulator-tables/dist/css/tabulator_bootstrap4.css'
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css'
import 'tabulator-tables/dist/css/tabulator_bootstrap5.css'
import 'tabulator-tables/dist/css/tabulator_bootstrap5.min.css'
import 'tabulator-tables/dist/css/tabulator_bulma.css'
import 'tabulator-tables/dist/css/tabulator_bulma.min.css'
import 'tabulator-tables/dist/css/tabulator_materialize.css'
import 'tabulator-tables/dist/css/tabulator_materialize.min.css'
import 'tabulator-tables/dist/css/tabulator_midnight.css'
import 'tabulator-tables/dist/css/tabulator_midnight.min.css'
import 'tabulator-tables/dist/css/tabulator_modern.css'
import 'tabulator-tables/dist/css/tabulator_modern.min.css'
import 'tabulator-tables/dist/css/tabulator_semanticui.css'
import 'tabulator-tables/dist/css/tabulator_semanticui.min.css'
import 'tabulator-tables/dist/css/tabulator_simple.css'
import 'tabulator-tables/dist/css/tabulator_simple.min.css'
import 'tabulator-tables/dist/css/tabulator_site_dark.css'
import 'tabulator-tables/dist/css/tabulator_site_dark.min.css'
import 'tabulator-tables/dist/css/tabulator_site.css'
import 'tabulator-tables/dist/css/tabulator_site.min.css'
import 'tabulator-tables/dist/css/tabulator.css'
import 'tabulator-tables/dist/css/tabulator.min.css'
*/
// npm install ag-grid-vue3 ag-grid-community
import {createGrid} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'; // 필수 CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // 선택적 테마
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
                        codeLength,  // 코드 길이
                    }, 
                    popupObjs : {
                        popup,       // dialog테그 객체
                        gridContainer, // 그리드 컨테이너
                        gridKind,    // 그리드 종류 (AgGrid / Tabulator)
                        btnClose,    // 팝업창의 우측 상단 [x] 버튼 객체
                        btnOk,       // 팝업창의 [선택]버튼 객체
                        btnCancel    // 팝업창의 [취소]버튼 객채
                    }, 
                    callback,        // 코드 선택 후 처리할 함수
                }
                */

                let codeList = null
                let grid = null
                
                // //////////////////////////////////////////////////////////////
                //
                // 데이터 관련 함수 선언
                //
                // //////////////////////////////////////////////////////////////
                const data = {
                    // ..........................................................
                    // data.getCodeList : 도움말에 사용할 코드목록 조회 함수
                    // ..........................................................
                    getCodeList : async function(){
                        if(args.codeList && args.codeList.length > 0){
                            args.codeList.forEach((item, index) => {
                                item.idx = index;
                                if(!item.codeName){
                                    item.codeName = `[ ${item.code} ] ${item.name} `
                                }
                            });
                            return args.codeList
                        }
    
                        let result = null
                        try{
                            const response = await axios.get(args.postUrl)
                            result = response.data.resData
                        } catch(error){
                            console.log(error)
                            return null // 오류 발
                        }
                        
                        result.forEach((item, index) => {
                            item.idx = index;
                            if(!item.codeName){
                                item.codeName = `[ ${item.code} ] ${item.name} `
                            }
                        });
    
                        return result
                    },
                    
                    // ..........................................................
                    // data.findCode : 팝업창에 사용할 코드 목록 필터링 함수 선언
                    // ..........................................................
                    findCode : async (param /* {code, name, codeName, codeList} */ )=>{
                        if(!codeList) return []
                        if(codeList.length == 0) return []
                        const paramCode     = param.code      ? param.code.toUpperCase()  : ''
                        const paramName     = param.name      ? param.name.toUpperCase()  : ''
                        const paramCodeName = param.codeName  ? param.codeName.toUpperCase()  : ''
                        
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
                            filteredCodeList = JSON.parse(JSON.stringify(param.codeList))
                        }

                        filteredCodeList.forEach((item, index) => {
                            item.idx = index; // 원본 배열의 각 항목에 idx 속성 추가
                        });

                        return filteredCodeList;
                        
                    }
                }

                // //////////////////////////////////////////////////////////////
                //
                // 팝업창 및 팝업창 내부 객체 관련 함수 선언
                //
                // //////////////////////////////////////////////////////////////
                const popup = {
                    // ..........................................................
                    // popup.onSelected : 그리드에서 코드가 선택되면 실행할 함수
                    // ..........................................................
                    onSelected : (param /* {btn, data={code, name, codeName}} */) => {
                        if(grid){
                            if(args.popupObjs.gridKind.toUpperCase() == 'AgGrid'.toUpperCase()){
                                grid.api.destroy()
                            } else if(args.popupObjs.gridKind.toUpperCase() == 'Tabulator'.toUpperCase()){
                                grid.destroy()
                            }
                            grid = null
                            while (args.popupObjs.gridContainer.firstChild) {
                                args.popupObjs.gridContainer.removeChild(args.popupObjs.gridContainer.firstChild);
                            }
                        }
                        
                        if(args.popupObjs.popup.open){
                            args.popupObjs.popup.close()
                        }
                        
                        if(param.data)  {
                            args.formObjs.edCode.value = param.data.code
                            args.formObjs.edName.value = param.data.name
                            args.formObjs.edCodeName.value = param.data.codeName
                        }
                        if(args.callback){
                            args.callback(param, args)
                        }
                    },
                    // ..........................................................
                    // popup.rowDblClick : 그리드의 행 더블클릭 이벤트
                    // ..........................................................
                    rowDblClick : (data) => {
                        popup.clearEvents()
                        const result = {
                            btn : "row",
                            data : data,
                        }
                        popup.onSelected(result)
                    },
                    
                    // ..........................................................
                    // popup.onBtnCloseClick : 팝업창의 닫기 버튼 클릭 이벤트
                    // ..........................................................
                    onBtnCloseClick : ()=>{
                        popup.clearEvents()
                        const result = {
                            btn  : "close",
                        }
                        popup.onSelected(result)
                    },

                    // ..........................................................
                    // popup.onBtnCancelClick : 팝업창의 취소 버튼 클릭 이벤트
                    // ..........................................................
                    onBtnCancelClick : ()=>{
                        popup.clearEvents()
                        const result = {
                            btn  : "cancel",
                        }
                        popup.onSelected(result)
                    },
                    
                    // ..........................................................
                    // popup.onBtnOkClick : 팝업창의 확인 버튼 클릭 이벤트
                    // ..........................................................
                    onBtnOkClick : ()=>{
                        popup.clearEvents()
                        const result = {
                            btn  : "ok",
                            data : null,
                        }
                        let selectedDatas = {}
                        if(args.popupObjs.gridKind.toUpperCase() == 'AgGrid'.toUpperCase()){
                            selectedDatas = grid.api.getSelectedRows()
                        } else if(args.popupObjs.gridKind.toUpperCase() == 'Tabulator'.toUpperCase()){
                            selectedDatas = grid.getSelectedData();
                        }
                        if(selectedDatas.length > 0){
                            result.data = selectedDatas[0]
                        }
                        popup.onSelected(result)
                    },
                    
                    // ..........................................................
                    // popup.clearEvents : 팝업창 버튼 이벤트 초기화
                    // ..........................................................
                    clearEvents : ()=>{
                        args.popupObjs.btnClose.removeEventListener('click', popup.onBtnCloseClick)
                        args.popupObjs.btnCancel.removeEventListener('click', popup.onBtnCancelClick)
                        args.popupObjs.btnOk.removeEventListener('click', popup.onBtnOkClick)
                    },

                    // ..........................................................
                    // popup.showModal : 팝업창을 modal로 여는 함수
                    // ..........................................................
                    showModal : async function(filteredCodeList){
                        if(!filteredCodeList) return
                        if(filteredCodeList.length == 0) return
                        if(args.popupObjs.gridKind.toUpperCase() == 'AgGrid'.toUpperCase()){
                            // popup.showModal - 팝업창에 AgGrid를 생성한다.
                            grid = await new Promise((resolve)=>{
                                const gridOptions = {
                                    columnDefs      : [
                                        { field: 'idx'      , headerName: '번호', flex: 1},
                                        { field: 'code'     , headerName: '코드', flex: 1},
                                        { field: 'name'     , headerName: '이름', flex: 1},
                                        { field: 'codeName' , headerName: '비고', flex: 2},
                                    ],
                                    rowData         : JSON.parse(JSON.stringify(filteredCodeList)),
                                    rowSelection    :'single',
                                    onGridReady     : (params) => {
                                        params.api.sizeColumnsToFit();
                                        params.api.addEventListener('rowDoubleClicked', function(event){
                                                                                            const data = event.data
                                                                                            popup.rowDblClick(data)
                                                                                        }
                                        )
                                        resolve(params)
                                    }
                                };
                                args.popupObjs.gridContainer.classList.add('ag-theme-quartz')
                                args.popupObjs.gridContainer.style.height = "500px"
                                createGrid(args.popupObjs.gridContainer, gridOptions);
                            })

                        } else if(args.popupObjs.gridKind.toUpperCase() == 'Tabulator'.toUpperCase()){
                            // popup.showModal - 팝업창에 Tabulator생성한다.
                            const gridOptions = {
                                columns :[
                                    {title:"번호", field:"idx"},
                                    {title:"코드", field:"code"},
                                    {title:"이름", field:"name"},
                                    {title:"비고", field:"codeName"},
                                ],
                                height  : 500,
                                data    : JSON.parse(JSON.stringify(filteredCodeList)),
                                selectableRows : 1,
                                selectableRangeMode : 'click',
                                selectableRowsRollingSelection : true,
                                layout  : "fitColumns",
                            }
                            grid = new Tabulator(args.popupObjs.gridContainer, gridOptions);
                            grid.on("rowDblClick", function(e, row){
                                                        const data = row.getData()
                                                        popup.rowDblClick(data)
                                                    }
                            )
                        }
                        // popup.showModal - 팝업창의 버튼 이벤트 설정
                        if(args.popupObjs.btnClose){
                            args.popupObjs.btnClose.addEventListener('click', popup.onBtnCloseClick)
                        }

                        if(args.popupObjs.btnCancel){
                            args.popupObjs.btnCancel.addEventListener('click', popup.onBtnCancelClick)
                        }

                        if(args.popupObjs.btnOk){
                            args.popupObjs.btnOk.addEventListener('click', popup.onBtnOkClick)
                        }
                        args.popupObjs.popup.showModal()
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

                codeList = await data.getCodeList()
                
                // ..............................................................
                // edCode 이벤트 정의
                // ..............................................................
                args.formObjs.edCode.addEventListener('focus', function(event) {
                    event.target.select(); // 포커스 시 텍스트 선택
                })

                args.formObjs.edCode.addEventListener("keyup", async (event)=>{
                    args.formObjs.edName.value = ''
                    args.formObjs.edCodeName.value = ''
                    if(event.key != 'Enter' && event.target.value.length < args.formObjs.codeLength){
                        return
                    }
                    
                    const param = {
                        code    : args.formObjs.edCode.value, 
                        name    : args.formObjs.edCode.edName, 
                        codeName: args.formObjs.edCode.edCodeName,
                        codeList  : JSON.parse(JSON.stringify(codeList)), 
                    } 
                    const filteredCodeList = await data.findCode(param)
                    
                    if(filteredCodeList.length == 1){
                        const result = {
                            btn : "",
                            data : {
                                code    : filteredCodeList[0].code,
                                name    : filteredCodeList[0].name,
                                codeName: filteredCodeList[0].codeName,
                            }
                        }
                        popup.onSelected(result)
                        return result
                    }
                    popup.showModal(filteredCodeList)
                })

                // ..............................................................
                // edName 이벤트 정의
                // ..............................................................
                args.formObjs.edName.addEventListener('focus', function(event) {
                    event.target.select(); // 포커스 시 텍스트 선택
                })

                args.formObjs.edName.addEventListener("keyup", async (event)=>{
                    args.formObjs.edCode.value = ''
                    args.formObjs.edCodeName.value = ''

                    if(event.key != 'Enter'){
                        return
                    }
                    const param = {
                        code    : args.formObjs.edCode.value, 
                        name    : args.formObjs.edName.value, 
                        codeName: args.formObjs.edCodeName.value,
                        codeList  : JSON.parse(JSON.stringify(codeList)), 
                    } 
                    const filteredCodeList = await data.findCode(param)
                    if(filteredCodeList.length == 1){
                        const result = {
                            btn : "",
                            data : {
                                code    : filteredCodeList[0].code,
                                name    : filteredCodeList[0].name,
                                codeName: filteredCodeList[0].codeName,
                            }
                        }
                        popup.onSelected(result)
                        return result
                    }
                    popup.showModal(filteredCodeList)
                })

                // ..............................................................
                // edCodeName 이벤트 정의
                // ..............................................................
                args.formObjs.edCodeName.addEventListener('focus', function(event) {
                    event.target.select(); // 포커스 시 텍스트 선택
                })

                args.formObjs.edCodeName.addEventListener("keyup", async (event)=>{
                    args.formObjs.edCode.value = ''
                    args.formObjs.edName.value = ''

                    if(event.key != 'Enter'){
                        return
                    }
                    const param = {
                        code    : args.formObjs.edCode.value, 
                        name    : args.formObjs.edName.value, 
                        codeName: args.formObjs.edCodeName.value, 
                        codeList: JSON.parse(JSON.stringify(codeList)), 
                    } 
                    const filteredCodeList = await data.findCode(param)
                    
                    if(filteredCodeList.length == 1){
                        const result = {
                            btn : "",
                            data : {
                                code    : filteredCodeList[0].code,
                                name    : filteredCodeList[0].name,
                                codeName: filteredCodeList[0].codeName,
                            }
                        }
                        popup.onSelected(result)
                        return result
                    }
                    popup.showModal(filteredCodeList)
                })

                // ..............................................................
                // btnSech
                // ..............................................................
                args.formObjs.btnSrch.addEventListener("click", async ()=>{
                    args.formObjs.edCode.value = ''
                    args.formObjs.edName.value = ''
                    args.formObjs.edCodeName.value = ''
                    const param = {
                        code    : args.formObjs.edCode.value, 
                        name    : args.formObjs.edName.value, 
                        codeName: args.formObjs.edCodeName.value,
                        codeList: JSON.parse(JSON.stringify(codeList)), 
                    } 
                    const filteredCodeList = await data.findCode(param)
                    
                    if(filteredCodeList.length == 1){
                        const result = {
                            btn : "",
                            data : {
                                code    : filteredCodeList[0].code,
                                name    : filteredCodeList[0].name,
                                codeName: filteredCodeList[0].codeName,
                            }
                        }
                        popup.onSelected(result)
                        return result
                    }
                    popup.showModal(filteredCodeList)
                })
            }
        }

        app.config.globalProperties.$helpComponent = helpComponent
        
    }

}


/* ========================================================================== *
 * SAMPLE CODE 
 * ========================================================================== *


// --------------------------------------------------------------------------
//  main.js
// --------------------------------------------------------------------------
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


// --------------------------------------------------------------------------
//  view Sample
// --------------------------------------------------------------------------
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
      <h4 class="title">공통 코드 목록</h4>
      <div ref="cntrCodeHelpDialog"/>
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
      codeList  : [                                      // 코드 목록
        { code : "D011", name : "관리부" },
        { code : "D012", name : "영업부" },
        { code : "D013", name : "사업부" },
        { code : "D021", name : "개발부" },
        { code : "D022", name : "생산1부" },
        { code : "D023", name : "생산2부" },
      ],
      postUrl : 'http://localhost:3000/getCodeList/DEPT', // codeList가 없는 경우 코드 조회를 위한 URL
      inputObjs : {
        edCode    : this.$refs.edDeptCodeRef,             // 코드입력 테그 객체
        edName    : this.$refs.edDeptNameRef,             // 이름입력 테그 객체
        edCodeName: this.$refs.edDeptCodeNameRef,         // "[ 코드 ] 이름"입력 테그 객체
        btnSrch   : this.$refs.btnDeptSrchRef,            // 조회버튼 객체
        codeLength: 4,                                    // 코드 길이
      },
      popupObjs   : {
        popup     : this.$refs.codeHelpDialog,            // dialog 테그 객체
        gridContainer:this.$refs.cntrCodeHelpDialog,      // 그리드 컨테이너 객체
        btnOk     : this.$refs.btnOk,                     // dialog의 ok버튼 객체
        btnCancel : this.$refs.btnCancel,                 // dialog의 [cancel]버튼 객체
        btnClose  : this.$refs.btnClose,                  // dialog의 죄측 상단 [x]버튼 객체
      },
      callback  : (param)=>{                              // 코드 선택 후 실행할 callback함수
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
 * ========================================================================== */