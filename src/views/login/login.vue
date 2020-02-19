
<template>
	<div id="Login">
		<div id="container">
			<div id="logo">
				<span style="font-size:43px;font-weight: bolder;font-style: italic;">登录</span>
			</div>
			<el-form :model="userInfo" :rules="rules" ref="loginForm" label-width="100px" class="loginForm">
				<el-form-item  prop="username" style="width: 100%">
					<el-input
							placeholder="账号"
							v-model="userInfo.username"
							style="width: 80%"
							clearable>
					</el-input>
				</el-form-item>
				<el-form-item  prop="password" style="width: 100%">
					<el-input
							placeholder="请输入密码"
							v-model="userInfo.password"
							style="width: 80%"
							show-password>

					</el-input>
				</el-form-item>
				<!--				验证码-->
				<el-form-item prop="dynamicCode">
					<div class="dynamicCode">
						<el-input v-model="userInfo.dynamicCode" style="width: 50%;" placeholder="验证码"></el-input>
						<div class="s-canvas">
							<canvas id="s-canvas" :width="contentWidth" :height="contentHeight" @click="drawPic"></canvas>
						</div>
					</div>
				</el-form-item>
			</el-form>
			<div class="foot">
				<el-button type="primary" @click="login">登录</el-button>

			</div>
		</div>
	</div>
</template>

<script>
	import SparkMD5 from 'spark-md5'

	export default {
		name: 'SIdentify',
		props: {
			identifyCode: {
				type: String,
				default: '1234'
			},
			fontSizeMin: {
				type: Number,
				default: 25
			},
			fontSizeMax: {
				type: Number,
				default: 30
			},
			backgroundColorMin: {
				type: Number,
				default: 255
			},
			backgroundColorMax: {
				type: Number,
				default: 255
			},
			colorMin: {
				type: Number,
				default: 0
			},
			colorMax: {
				type: Number,
				default: 160
			},
			lineColorMin: {
				type: Number,
				default: 100
			},
			lineColorMax: {
				type: Number,
				default: 255
			},
			dotColorMin: {
				type: Number,
				default: 0
			},
			dotColorMax: {
				type: Number,
				default: 255
			},
			contentWidth: {
				type: Number,
				default: 112
			},
			contentHeight: {
				type: Number,
				default: 31
			}
		},
		data(){
			var checkDynamicCode = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('动态码不能为空'));
				}
				if(value.toLowerCase()!=this.dynamicCode.toLowerCase()){
					return callback(new Error("验证码错误"));
				}
				callback();
			};
			return {
				userInfo:{
					username:"",
					password:"",
					dynamicCode:""
				},
				rules:{
					username: [
						{required:true,message: '请输入用户名', trigger: 'blur'}
					],
					password: [
						{required:true,message: '请输入密码', trigger: 'blur'}
					],
					dynamicCode: [
						{
							required: true,
							message: '请输入动态码',
							trigger: 'blur',
						},
						{validator:checkDynamicCode,trigger:"blur"}
					]
				}
			}
		},
		methods: {

			login(){
				let userinfo={...this.userInfo};
				localStorage.setItem("username",userinfo.username);
				this.$refs['loginForm'].validate((valid) => {
					if (valid) {
						//md5  密码加密
						userinfo.password = SparkMD5.hash(userinfo.password);        // hex hash
						// 登录操作
						this.$http.post(this.$apis.signin,userinfo).then((resp)=>{
							if(resp.data==0){
								this.$message({
									showClose: true,
									message: '该用户不存在！',
									type: 'error'
								});
								this.drawPic();
							}else if(resp.data==2){
								this.$message({
									showClose: true,
									message: '密码错误！',
									type: 'error'
								});
								this.drawPic();
							}else{
								localStorage.clear();
								localStorage.setItem('username', this.userInfo.username);
								this.$storages.setItem({
									name:"token",
									value:{
										vals:resp.data,
									},
									expires:30*60*1000//60*1000: 60s
								});

								var redirect = this.$route.query.comepath;
								if(redirect){
									this.$router.push({path:redirect});
								}else{
									this.$router.push("/home")
								}
							}



						})
					} else {
						return false;
					}
				});
			},
			// 生成一个随机数
			randomNum(min, max) {
				return Math.floor(Math.random() * (max - min) + min)
			},
			// 生成一个随机的颜色
			randomColor(min, max) {
				let r = this.randomNum(min, max)
				let g = this.randomNum(min, max)
				let b = this.randomNum(min, max)
				return 'rgb(' + r + ',' + g + ',' + b + ')'
			},
			drawPic()
			{
				let canvas = document.getElementById('s-canvas')
				let ctx = canvas.getContext('2d')
				ctx.textBaseline = 'bottom'
				// 绘制背景
				ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
				ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
				// 绘制文字
				this.dynamicCode='';
				for (let i = 0; i < this.identifyCode.length; i++) {
					var x=parseInt((Math.random())*10);
					this.dynamicCode +=x;
					this.drawText(ctx, x, i)
				}
				this.drawLine(ctx);
				this.drawDot(ctx)
			},
			drawText(ctx, txt, i) {
				ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
				ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
				let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
				let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
				var deg = this.randomNum(-45, 45)
				// 修改坐标原点和旋转角度
				ctx.translate(x, y)
				ctx.rotate(deg * Math.PI / 180)
				ctx.fillText(txt, 0, 0)
				// 恢复坐标原点和旋转角度
				ctx.rotate(-deg * Math.PI / 180)
				ctx.translate(-x, -y)
			},
			drawLine(ctx) {
				// 绘制干扰线
				for (let i = 0; i < 5; i++) {
					ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
					ctx.beginPath()
					ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
					ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
					ctx.stroke()
				}
			},
			drawDot(ctx) {
				// 绘制干扰点
				for (let i = 0; i < 80; i++) {
					ctx.fillStyle = this.randomColor(0, 255)
					ctx.beginPath()
					ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
					ctx.fill()
				}
			}
		},
		mounted() {
			this.drawPic();
		},
		created() {
			// this.$http.get(this.$apis.demo,this.userInfo).then((resp)=>{
			// 		console.log(resp)
			// });

		}
	}
</script>

<style lang="scss" scoped>

	#Login {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		background: gainsboro;
		#container{
			width: 500px;
			height: 300px;
			background: white;
			box-shadow: 0 0 10px gray;
			border-radius: 10px;
			align-self:center;
			#logo {
				width: 100%;
				height: 20%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.loginForm{
				width: 100%;
				height: 65%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
			.foot {
				width: 100%;
				height: 15%;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
			}
		}
		.dynamicCode{
			width: 100%;
			display: flex;
			flex-direction: row;
		}
	}


</style>