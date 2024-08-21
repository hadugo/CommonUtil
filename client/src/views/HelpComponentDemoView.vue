
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
      <p> </p>
      <p><b>[ 기능설명 ]</b></p>
      <ul><b>부서</b>
        <li><b>[코드] , [이름], [조회]</b>버튼으로 구성</li>
        <li><b>[코드]</b>입력란에서 [enter]키를 입력하면 모든 코드목록이 조회됩니다..</li>
        <li><b>[코드]</b>입력란에서 "D01"을 입력 후 [enter]키를 입력하면 코드에 "D01"이 포함된 코드 목록이 조회됩니다.</li>
        <li><b>[코드]</b>입력란에서 "D011"을 입력하면 "D011"에 해당하는 코드와 이름이 선택됩니다.</li>
        <li><b>[이름]</b>입력란에서 [enter]키를 입력하면 모든 코드 목록이 조회됩니다.</li>
        <li><b>[이름]</b>입력란에서 "생산"을 입력 후 [enter]키를 입력하면 이름에 "생산"이 포함된 코드 목록이 조회됩니다.</li>
        <li><b>[이름]</b>입력란에서 "영업"을 입력 후 [enter]키를 입력하면 "영업부"가 선택됩니다.</li>
        <li><b>[조회]</b>버튼을 클릭하면 모든 코드목록이 조회됩니다.</li>
      </ul>
      <ul><b>직급</b>
        <li><b>"[ D0010 ] 사원"</b>과 같은 표현식의 입력란과 <b>조회버튼</b>으로 구성</li>
        <li>[enter]키를 입력하면 모든 코드목록이 조회됩니다..</li>
        <li><b>"T01"</b>을 입력하면 코드에 "T01"이 포함된 코드 목록이 조회됩니다.</li>
        <li><b>"T011"</b>을 입력 후 [enter]키를 입력하면 "T011"에 해당하는 코드와 이름이 선택됩니다.</li>
        <li><b>"장"</b>을 입력 후 [enter]키를 입력하면 코드명에 "장"이 포함된 코드와 이름이 선택됩니다.</li>
        <li><b>[조회]</b>버튼을 클릭하면 모든 코드목록이 조회됩니다.</li>
      </ul>
      <ul><b>팝업창</b>
        <li>팝업창의 우측 상단의 [x]버튼을 클릭하면 창이 닫히고 callback함수가 실행됩니다.</li>
        <li>팝업창의 [cancel]버튼을 클릭하면 창이 닫히고 callback함수가 실행됩니다.</li>
        <li>팝업창의 그리드에서 코드를 선택하여 더블클릭하면 창이 닫히고 callback함수가 실행됩니다.</li>
        <li>팝업창의 그리드에서 코드를 선택한 후 [OK]버튼을 클릭하면 창이 닫히고 callback함수가 실행됩니다.</li>
      </ul>
    </div>
    <dialog class="modal" ref="codeHelpDialog">
      <div class="systemMenu">
        <span ref="btnClose" class="btnClose">x</span>
      </div>
      <h4 class="title">공통 코드 목록</h4>
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
        { code : "D013", name : "사업부" },
        { code : "D021", name : "개발부" },
        { code : "D022", name : "생산1부" },
        { code : "D023", name : "생산2부" },
      ],
      postUrl : 'http://localhost:3000/getCodeList/DEPT', // codeList가 없는 경우 코드 조회를 위한 URL
      inputObjs : {
        edCode    : this.$refs.edDeptCodeRef, 
        edName    : this.$refs.edDeptNameRef, 
        edCodeName: this.$refs.edDeptCodeNameRef,
        btnSrch   : this.$refs.btnDeptSrchRef, 
        codeLength: 4,
      },
      popupObjs   : {
        popup     : this.$refs.codeHelpDialog,
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
        codeLength: 4,
      },
      popupObjs   : {
        popup     : this.$refs.codeHelpDialog,
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
      width: 500px;
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

