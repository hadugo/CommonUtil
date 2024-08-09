
<template>
  <div>
    <div>
      <input ref="edDeptCodeRef">
      <input ref="edDeptNameRef">
      <input ref="edDeptCodeNameRef" type="hidden">
      <button ref="btnDeptSrchRef">...</button>
    </div>
    <div>
      <input ref="edTitlCodeRef">
      <input ref="edTitlNameRef">
      <input ref="edTitlCodeNameRef" type="hidden">
      <button ref="btnTitlSrchRef">...</button>
    </div>
    <dialog class="modal" ref="codeHelpDialog">
      <div class="systemMenu">
        <span ref="btnClose" class="btnClose">x</span>
      </div>
      <h4 ref="codeHelpDialogTitle" class="title"></h4>
      <div style="width: 400px; height:400px;">
        <div ref="cntrCodeHelpDialogGrid" style="width: 100%; height:100%;"></div>
      </div>
        <div class="buttonGroup">
        <button ref="btnOk">확인</button>
        <button ref="btnCancel">취소</button>
      </div>
    </dialog>
  </div>
</template>

<script>

import axios from 'axios'
// npm install tabulator-tables
import {TabulatorFull as Tabulator} from 'tabulator-tables';
// npm install ag-grid-vue3 ag-grid-community
// import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { createGrid  } from 'ag-grid-community'; // Ag-Grid API

export default {

  name: 'HelpComponentDemoView',

  components: {
  },

  mounted : function() {
    let param = {}
    param = {
      codeType  : 'DEPT', 
      edCode    : this.$refs.edDeptCodeRef, 
      edName    : this.$refs.edDeptNameRef, 
      edCodeName: this.$refs.edDeptCodeNameRef,
      btnSrch   : this.$refs.btnDeptSrchRef, 
      codeList  : null,
      gridType  : 'agGrid',
      callback  : (param)=>{
        const {btn, data} = param
        if(btn == "ok"){
          this.$refs.edDeptCodeRef.value = data.code
          this.$refs.edDeptNameRef.value = data.name
          this.$refs.edDeptCodeNameRef.value = data.codeName
        }
      },

    }
    this.helpComponentInit(param)
    
    param = {
      codeType  : 'TITL', 
      edCode    : this.$refs.edTitlCodeRef, 
      edName    : this.$refs.edTitlNameRef, 
      edCodeName: this.$refs.edTitlCodeNameRef,
      btnSrch   : this.$refs.btnTitlSrchRef, 
      codeList  : null,
      gridType  : 'agGrid',
      callback  : (param)=>{
        const {btn, data} = param
        if(btn == "ok"){
          this.$refs.edTitlCodeRef.value = data.code
          this.$refs.edTitlNameRef.value = data.name
          this.$refs.edTitlCodeNameRef.value = data.codeName
        }
      },

    }
    this.helpComponentInit(param)
  },

  data : function() {
    return {
    }
  },
  props: {
   
  },

  methods: {
    helpComponentInit : async function(param){
      // --------------------------------------------------------------
      // 파라미터 준비
      // --------------------------------------------------------------
      let {codeType, edCode, edName, edCodeName, btnSrch, codeList, gridType, callback} = param

      // ------------------------ Create Grid -------------------------
      let codeHelpDialogGrid = null
      if(gridType == 'agGrid'){
        // -------------------------- agGrud --------------------------
        this.$refs.cntrCodeHelpDialogGrid.className = 'ag-theme-quartz'
        codeHelpDialogGrid = await new Promise((resolve)=>{
          const gridOptions = {
            rowData: [],
            rowSelection: "single",
            columnDefs: [
              { field: "idx"      , flex: 1},
              { field: "code"     , flex: 1},
              { field: "name"     , flex: 1},
              { field: "codeName" , flex: 2},
            ],
            onGridReady: function(params) {
              resolve(params.api)
            }
          };
          createGrid(this.$refs.cntrCodeHelpDialogGrid, gridOptions);
        })
      
      } else if( gridType == 'Tabulator'){
        // ------------------------ Tabulator -------------------------
        codeHelpDialogGrid = new Tabulator(this.$refs.cntrCodeHelpDialogGrid, {
            data : [],
            layout:"fitDataFill",
            columns:[
              {title:"idx"      , field:"idx"     ,},
              {title:"code"     , field:"code"    ,},
              {title:"name"     , field:"name"    ,},
              {title:"codeName" , field:"codeName",},
            ],
        });
      }
      
      // --------------------------------------------------------------
      // 코드 조회 함수 선언
      // --------------------------------------------------------------
      const findCode = async (param)=>{

        const {codeType, edCode, edName, edCodeName, codeList, gridType} = param

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
        
        // ---------------------- Declare Function ----------------------
        const onSelected = (param) => {
          if(this.$refs.codeHelpDialog.open){
            this.$refs.codeHelpDialog.close()
          }
          if(callback){
            callback(param)
          }
          return param
        }
        
        // ----------------------- 코드 필터 시작 ------------------------
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

        // ------------------- Show DataList on Grid --------------------
        if(gridType == 'agGrid'){
          // -------------------------- agGrud --------------------------
          codeHelpDialogGrid.setGridOption("rowData", filteredCodeList);
        } else if( gridType == 'Tabulator'){
          codeHelpDialogGrid.replaceData(filteredCodeList)
        }
        
        // ----------------------- Declare Event ------------------------

        // grid double click event
        codeHelpDialogGrid.addEventListener('rowDoubleClicked', (event) => {
          result = {
            btn : "ok",
            data : event.data
          }
          onSelected(result)
        })

        // Close Button Click Event
        this.$refs.btnClose.addEventListener('click', ()=>{
          result = {
            btn  : "close",
            data : null
          }
          onSelected(result)
        })

        // Cancel Button Click Event
        this.$refs.btnCancel.addEventListener('click', ()=>{
          result = {
            btn  : "cancel",
            data : null
          }
          onSelected(result)
        })

        // Ok Button Click Event
        this.$refs.btnOk.addEventListener('click', ()=>{
          result = {
            btn  : "ok",
            data : {
              code : "",
              name : "",
              codeName : "",
            }
          }
          const selectedDatas = codeHelpDialogGrid.getSelectedRows()
          console.log(selectedDatas.length)
          if(selectedDatas.length > 0){
            result.data = selectedDatas[0]
          }
          onSelected(result)
        })

        // ------------------------ modal Open --------------------------
        this.$refs.codeHelpDialogTitle.textContent  = codeTypeName[codeType]
        this.$refs.codeHelpDialog.showModal()


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
      // 이벤트 정의
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
          gridType  : gridType,
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
          gridType  : gridType,
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
          gridType  : gridType,
        } 
        findCode(param)
      })

      // btnSech
      btnSrch.addEventListener("click", (event)=>{
        console.log(event)
      })

    }
  },

}
</script>

<style lang="scss" scoped>
  /* 
  =============================================
  AG-GRID
  =============================================
  */
  @import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
  @import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid


  /* 
  =============================================
  TABULATOR 
  =============================================
  */
  @import "tabulator-tables/dist/css/tabulator_simple.css"; 

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

