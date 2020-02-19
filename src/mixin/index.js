import Vue from 'vue';
import storage from '../utils/storage'
import {mapState} from "vuex"
import {mapMutations} from "vuex";
import da from "element-ui/src/locale/lang/da";
Vue.mixin({
	data(){
		return{
			colleges:["大数据",'音乐','美术'],

		}

	},
	computed:{

	},
	methods: {

		changlistd(data){
			this.$store.commit('CHANGLISTD',data)
		},


		//封装获取数据的方法
		async loadData(urlName,accounts,params={pageSize:8,pageNo:1}){
			var url = this.$apis[urlName];
			params.pageSize = params.pageSize?params.pageSize:8;
			var rs = await this.$http.get(url,params);
			this[accounts] = rs.data;
		},
		//操作确认函数,所有的删除弹出的提示都在这里实现
		operatoralert(action) {
			this.$alert('身份过期，请重新登录', '提示', {
				confirmButtonText: '确定',
				center:true
			}).then(()=>{
				action()
			});
		},
		tokens(){
			var token = storage.getItem("token");
			if(!token){
				// var action= ()=>{
				// 	this.$router.push("/login")
				// };
				// this.operatoralert(action);
				this.$router.push("/login");
				this.$alert('身份过期，请重新登录', '提示', {
					confirmButtonText: '确定',
					center:true
				})
			}
		},

	},

	filters:{
		formateDate(value) {
			var date = new Date(value);
			return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDay();
		}
	},
	created(){

	},
	mounted() {
		this.tokens();
		this.changlistd(this.$route.name);

	},


})
