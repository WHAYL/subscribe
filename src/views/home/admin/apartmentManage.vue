<template>
    <div id=apartment>
        <el-collapse  accordion>
            <el-collapse-item v-for="(item,index) in apartment" :title="item[0]" :name="index" :key="index">
                <div style="margin-left: 50px" v-for="(items,indexs) in item">
                    <el-collapse  accordion>
                        <el-collapse-item :title="indexs+'楼'" :name="indexs+'楼'" v-if="indexs!=0 && items!=undefined">
                            <div style="display:flex;width: 70%;justify-content: space-around;font-size: 18px">
                                <div>ID</div>
                                <div>房间号</div>
                                <div style="width: 60px">状态</div>
                            </div>
                            <div style="display: flex;justify-content:space-around" v-for="(itemss,indexss) in items" :key="indexss">
                                <div v-for="(itema,indexa) in itemss" :key="indexa" style="margin-top: 25px">
                                    {{itema}}
                                </div>
                                <div style="margin-top: 15px">
                                    <el-dropdown @command="handleCommand">
                                          <span class="el-dropdown-link" >
                                            状态<i class="el-icon-arrow-down el-icon--right"></i>
                                          </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="itemss[0]+',已预约'">已预约</el-dropdown-item>
                                            <el-dropdown-item :command="itemss[0]+',未预约'">未预约</el-dropdown-item>
                                            <el-dropdown-item :command="itemss[0]+',未开放'">未开放</el-dropdown-item>

                                        </el-dropdown-menu>
                                    </el-dropdown>
                                    <el-button type="danger" size="small" round @click="deleteapartment(item[0],itemss[0],itemss[1])">删除</el-button>
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-button type="primary" id="add" icon="el-icon-plus" @click="cl"></el-button>
        <div id="zz" v-if="show">
            <el-form :model="addform" :rules="rules" ref="addruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="楼栋" prop="building">
                    <el-select v-model="addform.building"  placeholder="请选择管理楼栋"  style="width: 300px">
                        <el-option v-for="(item,index) in building" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="房间号" prop="room">
                    <el-input v-model="addform.room" style="width: 300px" placeholder="请输入房间号"></el-input>
                </el-form-item>
                <el-form-item label="状态" style="width: 400px">
                    <el-radio-group v-model="addform.status">
                        <el-radio label="未开放"></el-radio>
                        <el-radio label="未预约"></el-radio>
                        <el-radio label="已预约"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item style="margin-left: 50px">
                    <el-button type="danger" @click="resetForm()" >重置</el-button>
                    <el-button type="primary" @click="addmanager" >添加</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: "apartmentManage",
        data() {
            return {
                show:false,
                building:[],
                builid:{},
                data:[],
                apartment:[],
                addform:{
                    building:'',
                    room:'',
                    status:'未开放',
                },
                rules: {

                    building: [
                        { required: true, message: '请选择楼栋', trigger: 'change' }

                    ],
                    room: [
                        { required: true, message: '请输入房间号', trigger: 'blur' },
                    ],


                }

                }

        },
        methods: {
            load(){

                var j=0;
                var x=0;
                var building=[];
                for(var i=0;i<this.data.length;i++){
                    if(this.data[i].status==0){
                        this.$set( this.data[i],'status','未预约');
                        //this.data[i].status='未预约';
                    }
                    if(this.data[i].status==1){
                        this.$set( this.data[i],'status','已预约');
                        //this.data[i].status='已预约';
                    }
                    if(this.data[i].status==2){
                        this.$set( this.data[i],'status','未开放');
                        //this.data[i].status='未开放';
                    }
                    if(building.indexOf(this.data[i].building.building)==-1){
                        var y=0;

                        this.$set(this.apartment,j,[]);
                        //this.apartment[j]=[];

                        this.$set(this.apartment[j],0,this.data[i].building.building);
                        //this.apartment[j].push(this.data[i].building.building);

                        this.$set(this.apartment[j],this.data[i].laboratory[0],[]);
                       // this.apartment[j][this.data[i].laboratory[0]]=[];


                        this.$set(this.apartment[j][this.data[i].laboratory[0]],y,[]);
                        //this.apartment[j][this.data[i].laboratory[0]][y++]=[];
                        //this.apartment[j][this.data[i].laboratory[0]].push([]);

                        x=this.apartment[j][this.data[i].laboratory[0]].length-1;

                        this.$set(this.apartment[j][this.data[i].laboratory[0]][x],0,this.data[i].id);
                        //this.apartment[j][this.data[i].laboratory[0]][x].push(this.data[i].id);

                        this.$set(this.apartment[j][this.data[i].laboratory[0]][x],1,this.data[i].laboratory);
                        //this.apartment[j][this.data[i].laboratory[0]][x].push(this.data[i].laboratory);

                        this.$set(this.apartment[j][this.data[i].laboratory[0]][x],2,this.data[i].status);
                        //this.apartment[j][this.data[i].laboratory[0]][x].push(this.data[i].status);
                        j++;
                        y++;
                        building.push(this.data[i].building.building);

                    }else {

                        var lxb=building.indexOf(this.data[i].building.building);
                        if(!Array.isArray( this.apartment[lxb][this.data[i].laboratory[0]]))
                            this.$set(this.apartment[lxb],this.data[i].laboratory[0],[]);
                            //this.apartment[lxb][this.data[i].laboratory[0]]=[];


                        this.apartment[lxb][this.data[i].laboratory[0]].push([]);

                        x=this.apartment[lxb][this.data[i].laboratory[0]].length-1;

                        this.$set(this.apartment[lxb][this.data[i].laboratory[0]][x],0,this.data[i].id);
                        //this.apartment[lxb][this.data[i].laboratory[0]][x].push(this.data[i].id);

                        this.$set(this.apartment[lxb][this.data[i].laboratory[0]][x],1,this.data[i].laboratory);
                        //this.apartment[lxb][this.data[i].laboratory[0]][x].push(this.data[i].laboratory);

                        this.$set(this.apartment[lxb][this.data[i].laboratory[0]][x],2,this.data[i].status);
                        //this.apartment[lxb][this.data[i].laboratory[0]][x].push(this.data[i].status);

                    }
                }







            },
            deleteapartment(a,b,c){
                var data={
                    building:a,
                    id:b,
                    room:c
                };
                this.$confirm('此操作将永久删除该实验室, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(this.$apis.deletelaboratory,data).then(async (resp)=>{
                        if(resp.data){
                           await  this.$http.get(this.$apis.laboratory).then(async (resp)=>{
                               this.data=resp.data;
                               this.apartment=[];
                               this.load();
                           });
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }

                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            handleCommand(command) {
                var arr=command.split(',');
                var status;
                if(arr[1]=="未开放"){
                    status=2
                }
                if(arr[1]=="未预约"){
                    status=0
                }
                if(arr[1]=="已预约"){
                    status=1
                }
                var data={
                    id:arr[0],
                    status:status
                };
                this.$http.post(this.$apis.updatestatus,data).then((resp)=>{
                    if(resp.data){
                        this.$http.get(this.$apis.laboratory).then((resp)=>{
                            this.data=resp.data;
                            this.load();
                        });
                        this.$message({
                            type: 'success',
                            message: '成功!'
                        });
                    }

                })

            },
            cl(){
                this.show=!this.show;
            },
            addmanager(){
                this.$refs.addruleForm.validate((valid) => {
                    if (valid) {
                        var status;
                        var data={...this.addform};
                        for(var x in this.builid){
                            if(x==data.building)
                               {
                                   data.building=this.builid[x];
                                    break;
                               }
                        }
                        if(this.addform.status=="未开放"){
                            data.status=2
                        }
                        if(this.addform.status=="未预约"){
                            data.status=0
                        }
                        if(this.addform.status=="已预约"){
                            data.status=1
                        }
                        this.$http.post(this.$apis.addlaboratory,data).then(async (resp)=>{

                            if(resp.data){
                                await this.$http.get(this.$apis.laboratory).then((resp)=>{
                                    this.data=resp.data;
                                    this.load();
                                });
                                this.show=false;
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                            }else{
                                this.$message.error('添加失败');
                            }

                        })
                    }
                });
            },
            resetForm() {
                this.$refs.addruleForm.resetFields();
            }
        },
        mounted() {
            this.$http.get(this.$apis.laboratory).then((resp)=>{
                this.data=resp.data;
                this.load();

            });
            this.$http.get(this.$apis.building).then((resp)=>{

                for(var i=0;i<resp.data.length;i++){
                    this.building.push(resp.data[i].building);
                    this.builid[resp.data[i].building]=resp.data[i].id;
                }
            })
        }
    }
</script>

<style scoped>
    #add{
        position:fixed;
        width: 40px;
        height: 40px;
        bottom: 80px;
        right: 20px;
        border-radius: 50%;

    }
    #zz{
        position:absolute;
        left:350px;
        top:130px;
        z-index:1;
        background-color: #D3DCE6;
        width: 450px;
        height: 280px;
        box-shadow: 0 0 10px gray;
        border-radius: 10px;
        padding-top: 50px;
    }
</style>