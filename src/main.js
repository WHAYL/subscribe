import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './mixin'
import storage from './utils/storage'
import './utils/myaxios'
import './apis/index'
import 'reset-css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import fr from "element-ui/src/locale/lang/fr";
Vue.use(ElementUI);
Vue.config.productionTip = false;



var vm=new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

router.beforeEach((to, from, next)=>{

  if(to.name =="login"){
    next();
    return;
  }
  var token = storage.getItem("token");
  if(token){
    next();
  }else {
    var path = to.path;
    vm.$notify({
      title: '警告',
      message: '身份过期，请重新登录！',
      type: 'warning',

    });
    next({path:"/login",query:{comepath:path}})
  }
});



