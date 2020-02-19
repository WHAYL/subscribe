<template>
    <div id="equipment">
        <el-collapse  accordion>
            <el-collapse-item v-for="(item,index) in equipment" :title="index" :key="index">
                <div style="margin-left: 50px" v-for="(items,indexs) in item" :key="indexs">
                    <el-collapse  accordion>
                        <el-collapse-item :title="indexs" >
                            <div style="display:flex;width: 70%;justify-content: space-around;font-size: 18px">
                                <div>ID</div>
                                <div>设备号</div>
                                <div style="width: 90px">状态</div>
                            </div>
                            <div style="display: flex;justify-content:space-around;width: 95%" v-for="(itemss,indexss) in items" :key="indexss">
                                <div style="margin-top: 15px;">{{itemss[2]}}</div>
                                <div style="margin-top: 15px;">{{indexss}}</div>
                                <div style="margin-top: 15px;">{{itemss[3]}}</div>
                                <div style="margin-top: 15px;">
                                    <el-dropdown @command="handleCommand">
                                          <span class="el-dropdown-link" >
                                            状态<i class="el-icon-arrow-down el-icon--right"></i>
                                          </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="itemss[2]+',空闲'">空闲</el-dropdown-item>
                                            <el-dropdown-item :command="itemss[2]+',已预约'">已预约</el-dropdown-item>
                                            <el-dropdown-item :command="itemss[2]+',待维修'">待维修</el-dropdown-item>

                                        </el-dropdown-menu>
                                    </el-dropdown>
                                    <el-button type="danger" size="small" round @click="deleteequipment(itemss[2])">删除</el-button>
                                </div>
                            </div>





                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    export default {
        name: "deleteequipment",
        data(){
            return{
                data:[],
                equipment:{},
                buildid:{},

            }
        },
        methods:{
            load(){
                var j=0;
                var x=0;
                var building=[];
                for(var i=0;i<this.data.length;i++){
                    if(this.data[i].status==0){
                        this.$set( this.data[i],'status','空闲');
                        //this.data[i].status='未预约';
                    }
                    if(this.data[i].status==1){
                        this.$set( this.data[i],'status','已预约');
                        //this.data[i].status='已预约';
                    }
                    if(this.data[i].status==2){
                        this.$set( this.data[i],'status','待维修');
                        //this.data[i].status='未开放';
                    }
                    if(this.equipment[this.data[i].laboratorys.building.building])
                    {
                        this.buildid[this.data[i].laboratorys.building.building]=this.data[i].laboratorys.building.id;
                        if(!this.equipment[this.data[i].laboratorys.building.building][this.data[i].laboratorys.laboratory]){
                            this.$set(this.equipment[this.data[i].laboratorys.building.building],this.data[i].laboratorys.laboratory,{});
                            //this.equipment[this.data[i].laboratorys.building.building][this.data[i].laboratorys.laboratory]={};

                        }
                        this.$set( this.equipment[this.data[i].laboratorys.building.building][this.data[i].laboratorys.laboratory],this.data[i].equipment,[
                            this.data[i].laboratorys.building.id,//楼栋id
                            this.data[i].laboratorys.id,//实验室id
                            this.data[i].id,//设备id
                            this.data[i].status//设备状态
                        ])


                        // this.equipment[this.data[i].laboratorys.building.building][this.data[i].laboratorys.laboratory][this.data[i].equipment]=[
                        //     this.data[i].laboratorys.building.id,//楼栋id
                        //     this.data[i].laboratorys.id,//实验室id
                        //     this.data[i].id,//设备id
                        //     this.data[i].status//设备状态
                        // ]


                    }else {
                        this.$set( this.equipment,this.data[i].laboratorys.building.building,{});
                        //this.equipment[this.data[i].laboratorys.building.building]={};

                        this.$set(this.equipment[this.data[i].laboratorys.building.building],this.data[i].laboratorys.laboratory,{});
                       // this.equipment[this.data[i].laboratorys.building.building][this.data[i].laboratorys.laboratory]={};

                        this.$set( this.equipment[this.data[i].laboratorys.building.building][this.data[i].laboratorys.laboratory],this.data[i].equipment,[
                            this.data[i].laboratorys.building.id,//楼栋id
                            this.data[i].laboratorys.id,//实验室id
                            this.data[i].id,//设备id
                            this.data[i].status//设备状态
                        ])
                        // this.equipment[this.data[i].laboratorys.building.building][this.data[i].laboratorys.laboratory][this.data[i].equipment]=[
                        //     this.data[i].laboratorys.building.id,//楼栋id
                        //     this.data[i].laboratorys.id,//实验室id
                        //     this.data[i].id,//设备id
                        //     this.data[i].status//设备状态
                        // ]
                    }

                }







            },
            handleCommand(command) {
                var arr=command.split(',');
                var status;
                if(arr[1]=="空闲"){
                    status=0
                }
                if(arr[1]=="已预约"){
                    status=1
                }
                if(arr[1]=="待维修"){
                    status=2
                }
                var data={
                    id:arr[0],
                    status:status
                };
                this.$http.post(this.$apis.updateequipment,data).then((resp)=>{
                    if(resp.data){
                        this.$http.get(this.$apis.equipments).then((resp)=>{
                            this.data=resp.data;
                            this.equipment={};
                            this.load();
                        });
                        this.$message({
                            type: 'success',
                            message: '成功!'
                        });
                    }

                })

            },
            deleteequipment(id){
                this.$http.post(this.$apis.deleteequipment,{id:id}).then((resp)=>{
                   if(resp.data){
                       this.$http.get(this.$apis.equipments).then((resp)=>{
                           this.data=resp.data;
                           this.equipment={};
                           this.load();
                       });
                       this.$message({
                           type: 'success',
                           message: '删除成功!'
                       });

                   }
                })
            }

        },
        mounted() {
            this.$http.get(this.$apis.equipments).then((resp)=>{
                this.data=resp.data;
                this.load();

            });







        }
    }
</script>

<style scoped>

</style>