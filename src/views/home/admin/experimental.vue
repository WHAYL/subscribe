<template>
    <div id="experimental">
        <div id="top">
            <div class="block">
                <span class="demonstration">楼栋/实验室：</span>
                <el-cascader
                        v-model="value"
                        :options="options"
                        :props="props"
                        collapse-tags
                        :clearable=false
                        clearable></el-cascader>
            </div>

            <div class="block">
                <span class="demonstration">请选择日期与时间：</span>
                <el-date-picker
                        v-model="value2"
                        type="datetimerange"
                        align="right"
                        :clearable=false
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['09:00:00', '21:00:00']"
                        value-format="timestamp"
                        @blur="ok"

                >
                </el-date-picker>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-search" @click="ok">搜索</el-button>
            </div>
        </div>
        <div id="main" v-show="apartment.length!=0">
            <el-collapse  accordion>
                <el-collapse-item v-for="(item,index) in apartment" :title="item[0]" :name="index" :key="index">
                    <div style="margin-left: 50px" v-for="(items,indexs) in item">
                        <el-collapse  accordion>
                            <el-collapse-item :title="indexs+'楼'" :name="indexs+'楼'" v-if="indexs!=0 && items!=undefined">
                                <div style="display:flex;width: 63%;justify-content: space-around;font-size: 18px">
                                    <div>ID</div>
                                    <div>房间号</div>

                                </div>
                                <div style="display: flex;justify-content:space-around;margin-top: 25px" v-for="(itemss,indexss) in items" :key="indexss">
                                    <div v-for="(itema,indexa) in itemss" :key="indexa" >
                                        {{itema}}
                                    </div>
                                    <div >
                                        <el-button type="primary" size="mini" round @click="yy(item[0],itemss[0],itemss[1])">预约</el-button>
                                    </div>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div id="lb" v-show="apartment.length==0">
            <div>
                推荐功能，敬请期待
            </div>

        </div>


    </div>
</template>

<script>
    import Storage from '../../../utils/storage'
    export default {
        data() {
            return {
                data: [],
                buildid:{},
                apartment:[],
                searchs:[],


                value:[],
                value2: '',
                props: { multiple: true },
                options: []
            };
        },


        methods:{
            ok(){
                this.apartment=[];
                if(this.value.length==0)
                {
                    this.$message({
                        message: '警告哦，请选择  楼栋/实验室',
                        type: 'warning'
                    });
                    this.apartment=[];
                    return false
                }
                if(this.value2==null || this.value2==''){
                    this.$message({
                        message: '警告哦，请选择日期与时间',
                        type: 'warning'
                    });
                    this.apartment=[];
                    return false
                }
                var oDate = new Date(this.value2[0]);
                var oYear = oDate.getFullYear();
                var oMonth = oDate.getMonth()+1;
                var oDay = oDate.getDate();
                var now = new Date();
                var year = now.getFullYear(); //得到年份
                var month = now.getMonth()+1;//得到月份
                var date = now.getDate();//得到日期

                if(oYear<=year && oMonth<=month && oDay<=date){
                    this.$message({
                        message: '不能选择   今天   和   以前   的日期哦',
                        type: 'warning'
                    });
                    return  false;
                }
                if(this.value2[1]-this.value2[0]<1800000){
                    this.$message({
                        message: '时间范围至少在30分钟',
                        type: 'warning'
                    });
                    return  false;
                }

                var data={
                    'username':localStorage.getItem('username'),
                    'role':Storage.getItem('token').vals[1],
                    'building':this.value,
                    'starttime':this.value2[0],
                    'endtime':this.value2[1]
                };
                this.$http.post(this.$apis.experimental,data).then((resp)=>{
                    if(Object.prototype.toString.call(resp.data) === '[object Object]')
                    {
                        var arr = [];
                        for (let i in resp.data) {
                            arr.push(resp.data[i])
                        }
                        resp.data=arr;
                    }
                    this.loads(resp.data);
                    if(this.apartment.length==0){
                        this.$message("该时段没有实验室哦 请重新选择实验室或时段");
                    }




                })

            },
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
                                value: this.data[i].id,
                                label: this.data[i].laboratory
                            });
                        this.buildid[this.data[i].building.building]=this.data[i].building.id;

                    }else {
                        this.options.push({
                            value: this.data[i].building.building,
                            label: this.data[i].building.building,
                            children: [{
                                value: this.data[i].id,
                                label: this.data[i].laboratory
                            }]
                        });
                        building.push(this.data[i].building.building);


                    }

                }







            },
            loads(data){

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
                    if(data.indexOf(this.data[i].id)!=-1){

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

                            //this.$set(this.apartment[j][this.data[i].laboratory[0]][x],2,this.data[i].status);
                            //this.apartment[j][this.data[i].laboratory[0]][x].push(this.data[i].status);
                            j++;
                            y++;
                            building.push(this.data[i].building.building);

                        }
                        else {

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

                            //this.$set(this.apartment[lxb][this.data[i].laboratory[0]][x],2,this.data[i].status);
                            //this.apartment[lxb][this.data[i].laboratory[0]][x].push(this.data[i].status);

                        }
                    }

                }

            },
            yy(a,b,c){
                //a:楼栋 b:实验室id c:实验室名

                var data={
                    'username':localStorage.getItem('username'),
                    'role':Storage.getItem('token').vals[1],
                    'laboratory':b,
                    'starttime':this.value2[0],
                    'endtime':this.value2[1]
                };
                var stime = new Date(this.value2[0]);
                var sy = stime.getFullYear(); //getFullYear方法以四位数字返回年份
                var sM = stime.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
                var sd = stime.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
                var sh = stime.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
                var sm = stime.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
                var ss = stime.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
                var star= sy + '-' + sM + '-' + sd + ' ' + sh + ':' + sm + ':' + ss;

                var etime = new Date(this.value2[1]);
                var y = etime.getFullYear(); //getFullYear方法以四位数字返回年份
                var M = etime.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
                var d = etime.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
                var h = etime.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
                var m = etime.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
                var s = etime.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
                var end= y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;

                this.$confirm(`确定预约实验室   ${a}--${c}   时间:${star}至${end}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(this.$apis.quer,data).then((resp)=>{
                        if(resp.data){

                            var datas={
                                'username':localStorage.getItem('username'),
                                'role':Storage.getItem('token').vals[1],
                                'building':this.value,
                                'starttime':this.value2[0],
                                'endtime':this.value2[1]
                            };
                            this.$http.post(this.$apis.experimental,datas).then((resp)=>{
                                if(Object.prototype.toString.call(resp.data) === '[object Object]')
                                {
                                    var arr = [];
                                    for (let i in resp.data) {
                                        arr.push(resp.data[i])
                                    }
                                    resp.data=arr;
                                }
                                this.apartment=[];
                                this.loads(resp.data);

                                if(this.apartment.length==0){
                                    this.$message("该时段没有实验室哦 请重新选择实验室或时段");
                                }




                            })
                            this.$message({
                                message: '预约成功',
                                type: 'success'
                            });
                        }
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消预约'
                    });
                });


            }

        },

        mounted() {
            this.$http.get(this.$apis.olaboratory).then((resp)=>{
                this.data=resp.data;
                this.load();
            })
        }
    };
</script>

<style scoped>
    #top{
        display: flex;
        justify-content:space-around ;
        align-items: center;
        width: 100%;
        height: 50px;
        background-color: #D3DCE6;
        box-shadow: 0 0 10px gray;
        border-radius: 10px;
    }
    #main{
        position: absolute;
        width: 90%;
        height: 90%;
        left: 5%;

    }
    #lb{
        position: absolute;
        display: flex;
        width: 90%;
        height: 85%;
        left: 5%;
        justify-content:center ;
        align-items: center;

    }
</style>