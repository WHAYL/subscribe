<template>

    <div id="home">
        <el-container style="height:100%">
            <el-aside width="200px">
                <el-row class="tac">
                    <el-col :span="24">
                        <!--
							遍历最外层的所有的权限
							key绑定的是 权限的_id
							index:是选项的下标,确保它被选中的时候是唯一的
						 -->

                        <el-menu
                                :default-active="listd"  class="el-menu-vertical-demo"
                                v-for="(item,index) in permissions" :key="item[0]">
                            <el-submenu :index="index+''" >
                                <template slot="title">
                                    <i class="el-icon-location"></i>
                                    <span>{{item[0]}}</span>
                                </template>
                                <!-- 遍历当前item权限的所有子权限 children -->
                                <el-menu-item
                                        v-for="(child,key) in item[1]" :key="child"
                                        @click="addTab(child)"
                                        v-bind:index="child"

                                >
                                    {{child}}
                                </el-menu-item>
                            </el-submenu>
                        </el-menu>
                    </el-col>
                </el-row>
            </el-aside>


            <el-container>

                <el-header>
                    <div style="width: 100%;height:100%;display: flex;align-items: center;justify-content: flex-end;">
                        <el-button icon="el-icon-switch-button" circle type="danger" @click="logout"></el-button>
                    </div>
                </el-header>

                <el-main>
                    <div v-if="!show" id="show">
                        <router-view></router-view>
                    </div>
                    <div v-else>
                        欢迎
                    </div>

                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>

    import Storage from '../../utils/storage'
    import {mapState} from "vuex"
    import { mapMutations } from 'vuex'


export default {
    name: 'home',
    data(){
    return{
        role:'',
        permissions: [],
        show:true,


    }
  },
    computed:{
        ...mapState(["listd","editableTabsValues"]),
    },
    watch:{

    },
    methods:{

        logout(){
            // 退出,就直接跳转到登录页面
            this.$confirm('退出系统, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                localStorage.clear();
                this.$router.push("/login")
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });



        },
        addTab(target){
            this.show=false;
            this.$router.push({name:target})//跳转值该路由
        }

    },
    created(){
        var token=Storage.getItem("token");
        if(token){
            this.role=token.vals[1];
            this.permissions=token.vals[2];
        }


    },
    mounted() {
      this.tokens();

      if(this.listd!=''){
          this.show=false;
          this.$router.push({name:this.listd})//跳转值该路由
      }

  },

}


</script>
<style lang="scss" scoped>
    #home {
        width: 100%;
        height: 100%;
    }
    #show{
        width: 100%;
        height: 100%;
    }
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }
    .el-main{
        position: relative;
        height: 100%;
    }
    #welcome{
        font-size: 50px;
        position: absolute;
        text-align: center;
        left:40%;
        top: 30%;
    }



</style>
