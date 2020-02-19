<template>
    <div id="student">
        <el-table
                :data="tableData"
                stripez
                height="95%"
                style="width: 100%;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="学生名称：">
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
                        <el-form-item label="所属学院：">
                            <span>{{ props.row.college }}</span>
                        </el-form-item>
                        <el-form-item label="专业：">
                            <span>{{ props.row.specialty }}</span>
                        </el-form-item>
                        <el-form-item label="所属班级：">
                            <span>{{ props.row.class }}</span>
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
                    label="性别"
                    prop="gender">
            </el-table-column>
            <el-table-column
                    align="right">
                <template slot="header" slot-scope="scope">
                    <el-input placeholder="请输入内容"   size="mini"  @input="change()" v-model="search" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" id="search" @click="searchs"></el-button>
                    </el-input>
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
        <el-pagination
                background
                layout="prev, pager, next"
                :total="tableData[0].count"
                :page-size=Number(10)
                :current-page=Number(pagee)
                @current-change="changeCurrentPage"
        >
        </el-pagination>



<!--        添加按钮-->
        <el-button type="primary" id="add" icon="el-icon-plus" @click="cl"></el-button>
<!--        修改面板-->
        <el-drawer
                :before-close="handleClose"
                :visible.sync="dialog"
                direction="rtl"
                custom-class="demo-drawer"
                ref="drawer"
                size="40%"
                style="height: 580px"
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
                    <el-form-item label="学院" >
                        <el-select v-model="form.college"  placeholder="请选择所属学院"  style="width: 300px">
                            <el-option v-for="(item,index) in colleges" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业" prop="specialty">
                        <el-input v-model="form.specialty" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="班级" prop="class">
                        <el-input v-model="form.class" style="width: 300px"></el-input>
                    </el-form-item>
                    <div class="demo-drawer__footer">
                        <el-button @click="cancelForm">取 消</el-button>
                        <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                    </div>
                </el-form>

            </div>
        </el-drawer>
<!--        添加面板-->
        <div id="zz" v-if="show">
            <el-form :model="addform" :rules="rules" ref="addruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="学生账号" prop="username">
                    <el-input v-model="addform.username" style="width: 300px"  placeholder="请输入账号" ></el-input>
                </el-form-item>
                <el-form-item label="学生密码" prop="password">
                    <el-input v-model="addform.username" style="width: 300px"  show-password placeholder="请输入密码" ></el-input>
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
                <el-form-item label="学院" >
                    <el-select v-model="addform.college"  placeholder="请选择所属学院"  style="width: 300px">
                        <el-option v-for="(item,index) in colleges" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="specialty">
                    <el-input v-model="addform.specialty" placeholder="请输入联系地址" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="班级" prop="class">
                    <el-input v-model="addform.class" placeholder="请输入联系地址" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="resetForm()" >重置</el-button>
                    <el-button type="primary" @click="addstudent" >添加</el-button>
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
                    college:'大数据',
                    specialty: '',
                    class:"",

                },
                pagee:'',
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
                    specialty: [
                        { required: true, message: '请输入专业', trigger: 'blur' },
                    ],
                    class:[
                        { required: true, message: '请输入班级', trigger: 'blur' }
                    ]
                }
            }
        },
        computed:{

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
                                await this.$http.post(this.$apis.updatestudent,this.form).then(async (resp)=>{

                                    if(resp.data){
                                        await  this.$http.get(this.$apis.students,{page:1}).then((resp)=>{

                                            this.tableData=resp.data;
                                            this.pagee='1';
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
                this.$confirm(`此操作将删除     学生     ${row.name}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$http.post(this.$apis.deletestudent,{t_id:row.id,u_id:row.users_id}).then(async (resp)=>{
                        if(resp.data){
                            await this.$http.get(this.$apis.students,{page:1}).then((resp)=>{
                                this.tableData=resp.data;
                                this.pagee='1';
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
                // var len=this.tableData.length;
                // this.us=(parseInt(this.tableData[len-1].users.username)+1)+'';



            },
            addstudent(){
                this.$refs.addruleForm.validate((valid) => {
                    if (valid) {

                        this.addform.password= SparkMD5.hash(   this.addform.password);

                        this.$http.post(this.$apis.addstudent,this.addform).then(async (resp)=>{
                            if(resp.data){
                                await  this.$http.get(this.$apis.students,{page:1}).then((resp)=>{
                                    this.tableData=resp.data;
                                    this.pagee='1';
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
            },
            searchs(){
                if(this.search!=''){
                    this.$http.get(this.$apis.students,{where:this.search}).then((resp)=>{
                        if(resp.data==''){
                            this.$message.error('错了哦，没有哦');
                        }else {
                            this.tableData=resp.data;
                        }

                    })
                }

            },
            change(){
                if(this.search==''){
                    this.$http.get(this.$apis.students,{page:1}).then((resp)=>{
                        this.tableData=resp.data;
                    })

                }
            },
            changeCurrentPage(pageNo){
                this.pagee=pageNo;
                this.$http.get(this.$apis.students,{page:pageNo}).then((resp)=>{
                    this.tableData=resp.data;


                })
            },


        },
        mounted() {
            this.tokens();
            this.$http.get(this.$apis.students,{page:1}).then((resp)=>{
                this.tableData=resp.data;

            })


        }

    }
</script>
<style scoped>
    #student{
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
        top:-20px;
        z-index:1;
        background-color: #D3DCE6;
        width: 60%;
        height: 600px;
        box-shadow: 0 0 10px gray;
        border-radius: 10px;
    }


</style>