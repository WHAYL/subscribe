<template>
    <div id="place">

        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    label="楼栋"
                    prop="building"
                   >
            </el-table-column>
            <el-table-column
                    label="管理员"
                    prop="admins.name"
                   >
            </el-table-column>
            <el-table-column
                    label="开放状态"
                    prop="status"
                   >
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-button type="primary" id="add" icon="el-icon-plus" @click="cl"></el-button>
        <el-drawer
                :before-close="handleClose"
                :visible.sync="dialog"
                direction="rtl"
                custom-class="demo-drawer"
                ref="drawer"
                size="40%"
                style="height: 500px;box-shadow: 0 0 10px gray;border-radius: 10px;"

        >
            <div class="demo-drawer__content" >
                <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="楼栋名称" prop="building">
                        <el-input v-model="form.building" style="width: 300px"></el-input>
                    </el-form-item>


                    <el-form-item label="楼栋管理员" >
                        <el-select v-model="ad"  placeholder="请选择管理员"  style="width: 300px">
                            <el-option v-for="(item,index) in adms" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="开放状态" style="width: 400px">
                        <el-radio-group v-model="form.status">
                            <el-radio label="未开放"></el-radio>
                            <el-radio label="开放"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <div class="demo-drawer__footer">
                        <el-button @click="cancelForm">取 消</el-button>
                        <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                    </div>
                </el-form>

            </div>
        </el-drawer>

        <div id="zz" v-if="show">
            <el-form :model="addform" :rules="rules" ref="addruleForm" label-width="100px" class="demo-ruleForm" style="position: absolute;top: 35px">
                <el-form-item label="楼栋名称" prop="building">
                    <el-input v-model="addform.building" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="楼栋管理员" >
                    <el-select v-model="addform.admin" placeholder="请选择管理员" style="width: 300px">
                        <el-option v-for="(item,index) in adms" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开放状态" style="width: 400px">
                    <el-radio-group v-model="addform.status">
                        <el-radio label="未开放"></el-radio>
                        <el-radio label="开放"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="resetForm()" >重置</el-button>
                    <el-button type="primary" @click="addbuilding" >添加</el-button>
                </el-form-item>
            </el-form>


        </div>
    </div>
</template>

<script>
    export default {
        name: "placeManage",
        data(){
            return{
                show:false,
                addform:{
                    building:'',
                    admin:'',
                    status:'未开放',
                },
                ad:'',
                adms:[],
                adminid:[],
                tableData: [],
                search: '',
                table: false,
                dialog: false,
                loading: false,
                form: {},
                formLabelWidth: '80px',
                timer: null,
                rules: {
                    building: [
                        { required: true, message: '请输入楼栋名称', trigger: 'blur' },
                    ],
                    region: [
                        { required: true, message: '请选择管理员', trigger: 'change' }
                    ],


                }
            }
        },
        methods:{
            handleClose(done) {
                if (this.loading) {
                    return;
                }
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.form.admin=this.ad;
                        this.form.adid=this.adminid.indexOf(this.ad);
                        this.$confirm('确定修改吗？')
                            .then(async _ => {
                                this.loading = true;
                                await this.$http.post(this.$apis.updatebuilding,this.form).then(async (resp)=>{
                                    if(resp.data){

                                        await this.$http.get(this.$apis.building).then((resp)=>{
                                            for(var i=0;i<resp.data.length;i++){
                                                if(resp.data[i].status===0){
                                                    resp.data[i].status='未开放'
                                                }
                                                if(resp.data[i].status===1){
                                                    resp.data[i].status='开放'
                                                }
                                            }
                                            this.tableData=resp.data;
                                            this.$message({
                                                message: '修改成功',
                                                type: 'success'
                                            });
                                        });
                                    }
                                });
                                this.timer = await setTimeout(async () => {
                                    done();
                                    // 动画关闭需要一定的时间
                                    await setTimeout(() => {
                                        this.loading = false;
                                    }, 100);

                                }, 500);

                            })
                            .catch(_ => {
                                this.loading = false;
                                this.dialog = false;
                                clearTimeout(this.timer);
                            });
                    }
                });


            },
            cancelForm() {
                this.loading = false;
                this.dialog = false;
                clearTimeout(this.timer);
            },


            handleUpdate(index, row) {
                this.dialog = true;
                this.form={...row};
                this.ad=this.form.admins.name;
            },
            handleDelete(index, row) {

                this.$confirm(`此操作将删除     楼栋    ${row.building}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$http.post(this.$apis.deletebuilding,{name:row.building}).then((resp)=>{
                        if(resp.data){
                            this.$http.get(this.$apis.building).then((resp)=>{
                                for(var i=0;i<resp.data.length;i++){
                                    if(resp.data[i].status===0){
                                        resp.data[i].status='未开放'
                                    }
                                    if(resp.data[i].status===1){
                                        resp.data[i].status='开放'
                                    }
                                }
                                this.tableData=resp.data;
                            });
                            this.$message({
                                type: 'success',
                                message: 'OK'
                            });
                        }else {
                            this.$message({
                                type: 'info',
                                message: '失败'
                            });
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });


            },
            cl(){
                this.show=!this.show;

            },
            addbuilding(){
                this.$refs.addruleForm.validate((valid) => {
                    if (valid) {
                        this.addform.adid=this.adminid.indexOf(this.addform.admin);
                        this.$http.post(this.$apis.addbuilding,this.addform).then(async (resp)=>{

                            if(resp.data){
                                await this.$http.get(this.$apis.building).then((resp)=>{
                                    for(var i=0;i<resp.data.length;i++){
                                        if(resp.data[i].status===0){
                                            resp.data[i].status='未开放'
                                        }
                                        if(resp.data[i].status===1){
                                            resp.data[i].status='开放'
                                        }
                                    }
                                    this.tableData=resp.data;
                                })
                                this.show=false;
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                            }else{
                                this.$message.error('添加失败');
                            }

                        })
                    } else {
                        alert('error submit!!');
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.addruleForm.resetFields();
            }

        },
        mounted() {
            this.$http.get(this.$apis.building).then((resp)=>{
                for(var i=0;i<resp.data.length;i++){
                    // if(resp.data[i].admins_id==null){
                    //     resp.data[i].admins={
                    //         name:"暂无"
                    //     }
                    // }
                    if(resp.data[i].status===0){
                        resp.data[i].status='未开放'
                    }
                    if(resp.data[i].status===1){
                        resp.data[i].status='开放'
                    }
                }
                this.tableData=resp.data;

            });

            this.$http.get(this.$apis.manager).then((resp)=>{

                for(var i=0;i<resp.data.length;i++){
                    this.adms.push(resp.data[i].name);
                    this.adminid[resp.data[i].id]=resp.data[i].name;
                }
                this.adms.unshift('无')

            })

        }
    }
</script>

<style scoped>
        #place{
            position: relative;
            width: 100%;
            height: 100%;
        }
        .demo-table-expand {
            font-size: 0;
        }
        .demo-table-expand label {
            width: 90px;
            color: #99a9bf;
        }
        .demo-table-expand .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
        }
        .demo-ruleForm{
            display: flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;

        }
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
            top:50px;
            z-index:1;
            background-color: #D3DCE6;
            width: 40%;
            height: 300px;
            box-shadow: 0 0 10px gray;
            border-radius: 10px;
        }
</style>