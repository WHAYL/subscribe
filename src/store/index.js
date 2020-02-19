import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    listd:'',//左边列表选定的目标


  },
  mutations: {
    CHANGLISTD(state,payload){
      state.listd=payload;
    },


  },
  actions: {
  },
  modules: {
  }
})
