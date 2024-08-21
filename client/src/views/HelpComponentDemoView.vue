
<template>
  <div>
    <div style="text-align: left">
       부서 : 
      <input ref="edDeptCodeRef">
      <input ref="edDeptNameRef">
      <input ref="edDeptCodeNameRef" type="hidden">
      <button ref="btnDeptSrchRef">...</button>
    </div>
    <div style="text-align: left">
      직급 : 
      <input ref="edTitlCodeRef" type="hidden">
      <input ref="edTitlNameRef" type="hidden">
      <input ref="edTitlCodeNameRef">
      <button ref="btnTitlSrchRef">...</button>
    </div>
    <div style="text-align: left">
      <p>[ 기능설명 ]</p>
      <ul><b>부서</b>
        <li><b>[코드] , [이름], [조회]</b>버튼으로 구성</li>
        <li><b>[코드]</b>입력란에서 [enter]키를 입력하면 코드 목록 조회</li>
        <li><b>[코드]</b>입력란에서 코드의 일부를 입력하고 [enter]키를 입력하면 입력한 글자가 포함된 코드 목록 조회</li>
        <li><b>[이름]</b>입력란에서 [enter]키를 입력하면 코드 목록 조회</li>
        <li><b>[코드]</b>입력란에서 코드의 일부를 입력하고 [enter]키를 입력하면 입력한 글자가 포함된 코드 목록 조회</li>
      </ul>
      <ul><b>직급</b>
        <li><b>"[ D0010 ] 사원"</b>과 같은 표현식의 입력란과 <b>조회버튼</b>으로 구성</li>
        <li><b>[코드]</b>입력란에서 [enter]키를 입력하면 코드 목록 조회</li>
        <li><b>[코드]</b>입력란에서 코드의 일부를 입력하고 [enter]키를 입력하면 입력한 글자가 포함된 코드 목록 조회</li>
        <li><b>[이름]</b>입력란에서 [enter]키를 입력하면 코드 목록 조회</li>
        <li><b>[코드]</b>입력란에서 코드의 일부를 입력하고 [enter]키를 입력하면 입력한 글자가 포함된 코드 목록 조회</li>
      </ul>
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

// npm install tabulator-tables
// import {TabulatorFull as Tabulator} from 'tabulator-tables';
// npm install ag-grid-vue3 ag-grid-community
// import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
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
  props: {
  },

  mounted : function() {
    let param = {}
    param = {
      codeList  : [
        { code : "D011", name : "관리부" },
        { code : "D012", name : "영업부" },
        { code : "D021", name : "개발부" },
        { code : "D022", name : "생산부" },
      ],
      postUrl : 'http://localhost:3000/getCodeList/DEPT', // codeList가 없는 경우 코드 조회를 위한 URL
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
    
    param = {
      codeList  : [
        { code : "T011", name : "대표" },
        { code : "T012", name : "부장" },
        { code : "T021", name : "과장" },
        { code : "T022", name : "사원" },
      ],
      postUrl : 'http://localhost:3000/getCodeList?codeType=TITL',
      postParam : {codeType  : 'TITL', },
      inputObjs : {
        edCode    : this.$refs.edTitlCodeRef, 
        edName    : this.$refs.edTitlNameRef, 
        edCodeName: this.$refs.edTitlCodeNameRef,
        btnSrch   : this.$refs.btnTitlSrchRef, 
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
        alert(`${btn}\n${code}\n${name}\n${codeName}`)
      },

    }
    this.$helpComponent.initial(param)
  },

  methods: {
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

