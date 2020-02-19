<template>
  <el-button type="primary" @click="cs">登录</el-button>

</template>
<script>
  import storage from '../utils/storage'
  export default {
    data(){
      return {
        randoms:[]
      }
    },
    methods: {
      cs(){
        var token = storage.getItem("token");

        if(token){
          this.$http.get(this.$apis.verify).then((resp)=>{
            console.log("cs",resp);
          })
        }else {
          var action= ()=>{
            this.$router.push("/login")
          };
          this.operatoralert(action);
        }

      },
    },
    mounted() {
      this.tokens();
    }
  }
</script>
<style scoped>
  .s-canvas {
    height: 38px;

  }
  .s-canvas canvas{
    margin-top: 1px;
    margin-left: 8px;
  }
</style>