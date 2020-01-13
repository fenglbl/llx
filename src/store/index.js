import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {//定义数据
    islogin:false,//是否登录
    tablePg:'home',//位于哪个页面
    user:{},//用户信息
    data:{},//页面数据
    tableType:"recommend",//首页位于哪个分类
    
  },
  mutations: {//修改函数
    login(state){state.islogin=true},//修改为已登录
    outlogin(state){state.islogin=false},//修改为未登录(退出登录)
    setTable(state,page){state.tablePg=page},//修改选中页
    setUser(state,user){state.user=user},//修改用户信息
    setData(state,data){state.data=data;},//修改页面数据
    setTableType(state,type){state.tableType=type},//修改首页的分类
  },
  getters:{//获取数据
    getIsLogin(state){return state.islogin},//获取登录信息
    getTable(state){return state.tablePg},//获取选中页信息
    getUser(state){return state.user},//获取用户信息
    getData(state){return state.data},//获取页面数据
    getTableType(state){return state.tableType},//获取首页的分类
  },
  actions: {
  },
  modules: {
  }
})
