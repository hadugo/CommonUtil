
<template>
  <div>
    <div>
       부서 : 
      <input ref="edDeptCodeRef">
      <input ref="edDeptNameRef">
      <input ref="edDeptCodeNameRef" type="hidden">
      <button ref="btnDeptSrchRef">...</button>
    </div>
    <div>
      직급 : 
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
    
    param = {
      codeList  : null,
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

