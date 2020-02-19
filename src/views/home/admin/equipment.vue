<template>
    <div id="equipment">
        <div id="top">
            <div class="block">
                <span class="demonstration">楼栋/实验室/设备号：</span>
                <el-cascader
                        v-model="value"
                        :options="options"
                        :props="props"
                        collapse-tags
                        :clearable=false
                        clearable

                ></el-cascader>
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
                                <div style="margin-left: 50px" v-for="(itemss,indexss) in items" :key="indexss">
                                    <el-collapse  accordion>
                                        <el-collapse-item :title="itemss[0]" :name="itemss[0]"  >
                                            <div style="width:61%;display: flex;justify-content: space-around">
                                                <div>ID</div>
                                                <div>设备号</div>
                                            </div>
                                            <div style="width:95%;margin-top:10px;display: flex;justify-content: space-around" v-for="(itemsss,indexsss) in itemss" :key="indexsss" v-if="indexsss!=0">

                                                <div v-for="(itemssss,indexssss) in itemsss" :key="indexssss">
                                                    {{itemssss}}
                                                </div>
                                                <div >
                                                    <el-button type="primary" size="mini" @click="yy(itemsss[0],item[0],itemss[0],itemsss[1])" round >预约</el-button>
                                                </div>


                                            </div>

                                        </el-collapse-item>
                                    </el-collapse>


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
        name: "equipment",
        data() {
            return {
                data:[],
                buildid:{},
                apartment:[],
                searchs:[],


                value:[],
                value2: [],
                props: { multiple: true },
                options: []
            };
        },
        methods:{
            load(){
                var x=0;
                var y=-1;
                var building=[];
                for(var i=0;i<this.data.length;i++){
                    if(building.indexOf(this.data[i].laboratorys.building.building)!=-1)
                    {
                        for(var j=0;j<building.length;j++){
                            if(this.data[i].laboratorys.building.building==building[j]){
                                x=j;
                                break;
                            }
                        }

                        for(var n=0;n<this.options[x].children.length;n++){
                            if(this.options[x].children[n].value==this.data[i].laboratorys.id){

                                y=n;

                                break;
                            }
                        }
                        if(y==-1)
                        {
                                    this.options[x].children.push({
                                    value: this.data[i].laboratorys.id,
                                    label: this.data[i].laboratorys.laboratory,
                                    children: [
                                        { value: this.data[i].id, label: this.data[i].equipment },

                                    ]
                                });
                        }else {
                            this.options[x].children[y].children.push({
                                value: this.data[i].id,
                                label: this.data[i].equipment
                            })
                        }

                        this.buildid[this.data[i].laboratorys.building.building]=this.data[i].laboratorys.building.id;

                    }else {
                        this.options.push({
                            value: this.data[i].laboratorys.building.id,
                            label: this.data[i].laboratorys.building.building,
                            children: [{
                                value: this.data[i].laboratorys.id,
                                label: this.data[i].laboratorys.laboratory,
                                children: [
                                    { value: this.data[i].id, label: this.data[i].equipment },

                                ]
                            }]
                        });
                        building.push(this.data[i].laboratorys.building.building);


                    }

                }







            },
            ok(){
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
                //开始时间
                var oDate = new Date(this.value2[0]);
                var oYear = oDate.getFullYear();
                var oMonth = oDate.getMonth()+1;
                var oDay = oDate.getDate();
                var ohour = oDate.getHours();//得到小时
                var ominu = oDate.getMinutes();//得到分钟
                var osec = oDate.getSeconds();//得到秒
                //结束时间
                var yDate = new Date(this.value2[1]);
                var yYear = yDate.getFullYear();
                var yMonth = yDate.getMonth()+1;
                var yDay = yDate.getDate();

                //当天时间
                var now = new Date();
                var year = now.getFullYear(); //得到年份
                var month = now.getMonth()+1;//得到月份
                var date = now.getDate();//得到日期
                var hour = now.getHours();//得到小时
                var minu = now.getMinutes();//得到分钟
                var sec = now.getSeconds();//得到秒
                //明天时间
                var day3 = new Date();
                day3.setTime(day3.getTime()+24*60*60*1000);
                var s1 = day3.getFullYear();
                var s2=day3.getMonth()+1;
                var s3=day3.getDate();




                if(oYear<year || oMonth<month || oDay<date || yYear>s1 || yMonth>s2 || yDay>s3){
                    this.$message({
                        message: '只能选择   今天   和   明天   的日期哦',
                        type: 'warning'
                    });
                    return  false;
                }

                var timestamp = Date.parse(new Date());

                if(timestamp>=this.value2[0])
                {
                    this.$message({
                        message: '请规范选择你的时间',
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

                this.apartment=[];
                this.$http.post(this.$apis.isequ,data).then((resp)=>{
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
                    console.log(this.apartment)


                })






            },
            loads(data){

                var j=0;
                var x=0;
                var k=0;
                var building=[];
                for(var i=0;i<this.data.length;i++){

                    if(data.indexOf(this.data[i].id)!=-1){

                        if(building.indexOf(this.data[i].laboratorys.building.building)==-1){
                            var y=0;
                            this.$set(this.apartment,j,[]);
                            this.$set(this.apartment[j],0,this.data[i].laboratorys.building.building);
                            this.$set(this.apartment[j],this.data[i].laboratorys.laboratory[0],[]);
                            this.$set(this.apartment[j][this.data[i].laboratorys.laboratory[0]],y,[]);
                            this.$set(this.apartment[j][this.data[i].laboratorys.laboratory[0]][0],0,this.data[i].laboratorys.laboratory);
                            this.apartment[j][this.data[i].laboratorys.laboratory[0]][0].push([
                                this.data[i].id,this.data[i].equipment
                            ]);
                            j++;
                            y++;
                            building.push(this.data[i].laboratorys.building.building);
                        }
                        else {
                            var lxb=building.indexOf(this.data[i].laboratorys.building.building);
                            if(!Array.isArray( this.apartment[lxb][this.data[i].laboratorys.laboratory[0]])){
                                this.$set(this.apartment[lxb],this.data[i].laboratorys.laboratory[0],[]);

                                this.$set(this.apartment[lxb][this.data[i].laboratorys.laboratory[0]],0,[]);
                                this.$set(this.apartment[lxb][this.data[i].laboratorys.laboratory[0]][0],0,this.data[i].laboratorys.laboratory);
                                this.apartment[lxb][this.data[i].laboratorys.laboratory[0]][0].push([
                                    this.data[i].id,this.data[i].equipment
                                ]);
                            }
                            else {
                                var t=0;
                                for(var k=0;k<this.apartment[lxb][this.data[i].laboratorys.laboratory[0]].length;k++){
                                    if(this.apartment[lxb][this.data[i].laboratorys.laboratory[0]][k][0]==this.data[i].laboratorys.laboratory){
                                        this.apartment[lxb][this.data[i].laboratorys.laboratory[0]][k].push([
                                            this.data[i].id,this.data[i].equipment
                                        ]);
                                        break;
                                    }else {
                                        t=1;
                                    }
                                }
                                if(t==1){
                                    this.apartment[lxb][this.data[i].laboratorys.laboratory[0]].push([
                                           this.data[i].laboratorys.laboratory,[
                                            this.data[i].id,this.data[i].equipment
                                        ]
                                    ])
                                }
                            }



                        }
                    }

                }

            },
            yy(da,a,b,c){
                var data={
                    'username':localStorage.getItem('username'),
                    'role':Storage.getItem('token').vals[1],
                    'equipments':da,
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


                this.$confirm(`确定预约设备   ${a}--${b}--${c}   时间:${star}至${end}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.$http.post(this.$apis.inserequipment,data).then((resp)=>{
                           if(resp.data){
                               this.$message({
                                   message: '预约成功',
                                   type: 'success'
                               });

                               this.apartment=[];
                               var datas={
                                   'username':localStorage.getItem('username'),
                                   'role':Storage.getItem('token').vals[1],
                                   'building':this.value,
                                   'starttime':this.value2[0],
                                   'endtime':this.value2[1]
                               };


                               this.$http.post(this.$apis.isequ,datas).then((resp)=>{
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
            this.$http.get(this.$apis.queryequ).then((resp)=>{
                this.data=resp.data;
                this.load();
            })

        }
    }
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