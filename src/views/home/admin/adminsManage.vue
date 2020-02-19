<template>
    <div id="manager">
        <el-table
                :data="tableData.filter(
                data => !search ||
                data.name.toLowerCase().includes(search.toLowerCase()) ||
                data.building.toLowerCase().includes(search.toLowerCase()) ||
                data.users.username.toLowerCase().includes(search.toLowerCase())
                ) "
                stripez
                style="width: 100%;height: 100%">


            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="管理员名称：">
                            <span>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item label="性别：">
                            <span>{{ props.row.gender }}</span>
                        </el-form-item>
                        <el-form-item label="邮箱地址：">
                            <span>{{ props.row.email }}</span>
                        </el-form-item>
                        <el-form-item label="电话：">
                            <span>{{ props.row.phone }}</span>
                        </el-form-item>
                        <el-form-item label="联系地址：">
                            <span>{{ props.row.address }}</span>
                        </el-form-item>
                        <el-form-item label="管理楼栋：">
                            <span>{{ props.row.building }}</span>
                        </el-form-item>


                    </el-form>
                </template>
            </el-table-column>

            <el-table-column
                    label="账号"
                    prop="users.username">
            </el-table-column>
            <el-table-column
                    label="姓名"
                    prop="name">
            </el-table-column>
            <el-table-column
                    label="管理楼栋"
                    prop="building">
            </el-table-column>
            <el-table-column
                    align="right">
                <template slot="header" slot-scope="scope">
                    <el-input
                            v-model="search"
                            size="mini"
                            placeholder="输入关键字搜索"/>
                </template>

                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleUpdate(scope.$index, scope.row)">Update</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
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
                style="height: 550px"
        >
            <div class="demo-drawer__content">
                <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" style="width: 400px">
                        <el-radio-group v-model="form.gender">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model="form.phone" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="管理楼栋" >
                        <el-select v-model="form.building"  placeholder="请选择管理楼栋"  style="width: 300px">
                            <el-option v-for="(item,index) in building" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系地址" prop="address">
                        <el-input v-model="form.address" style="width: 300px"></el-input>
                    </el-form-item>
                    <div class="demo-drawer__footer">
                        <el-button @click="cancelForm">取 消</el-button>
                        <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                    </div>
                </el-form>

            </div>
        </el-drawer>
        <div id="zz" v-if="show">
            <el-form :model="addform" :rules="rules" ref="addruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="管理员账号" prop="username">
                    <el-input v-model="addform.username" style="width: 300px"  placeholder="请输入账号" ></el-input>
                </el-form-item>
                <el-form-item label="管理员密码" prop="password">
                    <el-input v-model="addform.username" style="width: 300px" show-password placeholder="请输入密码" ></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addform.name" style="width: 300px" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别" style="width: 400px">
                    <el-radio-group v-model="addform.gender">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addform.email" style="width: 300px" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="addform.phone" style="width: 300px" placeholder="请输入电话"></el-input>
                </el-form-item>
                <el-form-item label="管理楼栋" >
                    <el-select v-model="addform.building"  placeholder="请选择管理楼栋"  style="width: 300px">
                        <el-option v-for="(item,index) in building" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系地址" prop="address">
                    <el-input v-model="addform.address" placeholder="请输入联系地址" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="resetForm()" >重置</el-button>
                    <el-button type="primary" @click="addmanager" >添加</el-button>
                </el-form-item>

            </el-form>
        </div>


    </div>

</template>
<script>
    import storage from '../../../utils/storage'
    import SparkMD5 from 'spark-md5'
    export default {
        data() {
            return {
                show:false,
                addform:{
                    username:'',
                    password:'',
                    name:'',
                    gender:'男',
                    email: '',
                    phone: '',
                    building:'无',
                    address: '',

                },
                building:[],
                tableData: [],
                search: '',
                table: false,
                dialog: false,
                loading: false,
                form: {},
                formLabelWidth: '80px',
                timer: null,
                rules: {

                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },

                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请输入联系地址', trigger: 'blur' },
                    ],
                }
            }
        },
        methods: {
            handleClose(done) {
                if (this.loading) {
                    return;
                }
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确定修改吗？')
                            .then(async _ => {
                                this.loading = true;
                                await this.$http.post(this.$apis.updatemanager,this.form).then(async (resp)=>{
                                    if(resp.data){
                                        await  this.$http.get(this.$apis.manager).then((resp)=>{
                                            this.tableData=resp.data;
                                            this.$message({
                                                message: '修改成功',
                                                type: 'success'
                                            });
                                        })
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

            },
            handleDelete(index, row) {
                this.$confirm(`此操作将删除     管理员     ${row.name}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$http.post(this.$apis.deletemanager,{t_id:row.id,u_id:row.users_id}).then((resp)=>{
                        if(resp.data){
                            this.$http.get(this.$apis.manager).then((resp)=>{
                                this.tableData=resp.data;
                            })
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
            addmanager(){
                this.$refs.addruleForm.validate((valid) => {
                    if (valid) {

                        this.addform.password= SparkMD5.hash( this.addform.password);
                        this.$http.post(this.$apis.addmanager,this.addform).then(async (resp)=>{
                            if(resp.data){
                                await this.$http.get(this.$apis.manager).then((resp)=>{
                                    this.tableData=resp.data;
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
            this.tokens();
            this.$http.get(this.$apis.manager).then((resp)=>{
                this.tableData=resp.data;
            });

            this.$http.get(this.$apis.building).then((resp)=>{
                for(var i=0;i<resp.data.length;i++){
                    this.building.push(resp.data[i].building)
                }
                this.building.unshift('无')
            })


        }

    }
</script>
<style scoped>
    #manager{
        position: relative;
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
        left:200px;
        top:0px;
        z-index:1;
        background-color: #D3DCE6;
        width: 60%;
        height: 550px;
        box-shadow: 0 0 10px gray;
        border-radius: 10px;
    }
</style>