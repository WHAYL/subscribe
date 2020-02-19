<template>
    <div id="addequipment">
        <div id="main">
            <el-form :model="addform" :rules="rules" ref="addruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="楼栋/房间号" >
                    <el-cascader
                            v-model="addform.value"
                            :options="options"
                            :props="{ expandTrigger: 'hover' }"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="设备号" prop="id">
                    <el-input v-model="addform.id" style="width: 220px"  placeholder="请输入设备号" ></el-input>
                </el-form-item>

                <el-form-item label="状态">
                    <el-radio-group v-model="addform.status">
                        <el-radio label="空闲"></el-radio>
                        <el-radio label="已预约"></el-radio>
                        <el-radio label="待维修"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="resetForm()" >重置</el-button>
                    <el-button type="primary" @click="addequipment()" >添加</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "addequipment",
        data(){
            return {
                data: [],
                equipment: {},
                buildid:{},
                value: [],
                options: [],
                addform:{
                    value:[],
                    id:'',
                    status:'空闲'
                },
                rules: {
                    id: [
                        { required: true, message: '请输入设备号', trigger: 'blur' },
                    ],

                }

            }
        },
        methods:{
            load(){
                var x=0;
                var building=[];
                for(var i=0;i<this.data.length;i++){
                    if(building.indexOf(this.data[i].building.building)!=-1)
                    {
                        for(var j=0;j<building.length;j++){
                            if(this.data[i].building.building==building[j]){
                                x=j;
                                break;
                            }
                        }
                        if(this.data[i].laboratory!= this.options[x].children[this.options[x].children.length-1].value)
                            this.options[x].children.push({
                                value: this.data[i].laboratory,
                                label: this.data[i].laboratory
                            });
                        this.buildid[this.data[i].building.building]=this.data[i].building.id;

                    }else {
                        this.options.push({
                            value: this.data[i].building.id,
                            label: this.data[i].building.building,
                            children: [{
                                value: this.data[i].laboratory,
                                label: this.data[i].laboratory
                            }]
                        });
                        building.push(this.data[i].building.building);
                    }

                }







            },
            addequipment(){
                this.$refs.addruleForm.validate((valid) => {
                    if (valid) {
                        if(!this.addform.value){
                            this.$message({
                                showClose: true,
                                message: '请选择楼栋/房间号',
                                type: 'warning'
                            });
                            return false;
                        }
                        var status='';
                        if(this.addform.status=='空闲'){
                            status=0;
                        }
                        if(this.addform.status=='已预约'){
                            status=1;
                        }
                        if(this.addform.status=='待维修'){
                            status=2;
                        }
                        var data={
                            'builid':this.addform.value[0],
                            'room':this.addform.value[1],
                            'equipment':this.addform.id,
                            'status':status

                        };




                        this.$http.post(this.$apis.addequipment,data).then(async (resp)=>{

                            if(resp.data){
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                await this.$http.get(this.$apis.equipments).then((resp)=>{
                                    this.data=resp.data;
                                    this.load();

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

            })
        }
    }
</script>

<style scoped>
    #addequipment{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #main{
        display: flex;
        left:200px;
        top:0px;
        z-index:1;
        background-color: #D3DCE6;
        width: 40%;
        height: 300px;
        box-shadow: 0 0 10px gray;
        border-radius: 10px;
        justify-content: center;
        align-items: center;
    }
</style>