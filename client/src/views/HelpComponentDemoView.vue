
<template>
  <div>
    <div>
      <input ref="edDeptCodeRef">
      <input ref="edDeptNameRef">
      <button ref="btnDeptSrchRef">...</button>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {

  name: 'HelpComponentDemoView',

  created : function() {

  },

  mounted : function() {

  },

  data : function() {
    return {
    }
  },
  props: {
   
  },

  methods: {
    helpComponentInit(param){
      const {codeType, edCodeRef, edNameRef, btnSrchRef, codeList} = param


      const getCodeList = async function(codeType){
        const formData = new FormData()
        const svo = {
          searchDvo : {
            codeType : codeType
          }
        }
        const svoStr = JSON.stringify(svo)
        formData.append('svo', new Blob([svoStr], {type : 'application/json'}), 'svo')
        const URL = 'http://localhost:3000/getCodeList'
        let data = null
        try{
          const response = await axios.post(URL, formData)
          data = response.data
        } catch(error){
          console.log(error)
        }

        
      }
    }
  },

}
</script>

<style lang="scss" scoped>

</style>

