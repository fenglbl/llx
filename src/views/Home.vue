<template>
  <div class="home">
    <!-- 内容面板 -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="home">
        <index></index>
      </mt-tab-container-item>
      <mt-tab-container-item id="find">
        <find :active="findActive"></find>
      </mt-tab-container-item>
      <mt-tab-container-item id="msg">
        <msg></msg>
      </mt-tab-container-item>
      <mt-tab-container-item id="me">
        <me></me>
      </mt-tab-container-item>
    </mt-tab-container>
    <!-- 底部导航栏 -->
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="home">
        <img slot="icon" :src="`img/home${selected=='home'?'_active':''}.png`">
        主页
      </mt-tab-item>
      <mt-tab-item id="find">
        <img slot="icon" :src="`img/find${selected=='find'?'_active':''}.png`">
        发现
      </mt-tab-item>
      <div id="up" class="upup" @click="upto">
        <img slot="icon" src="img/rel.png">
      </div>
      <mt-tab-item id="msg">
        <img slot="icon" :src="`img/msg${selected=='msg'?'_active':''}.png`">
        消息
      </mt-tab-item>
      <mt-tab-item id="me">
        <img slot="icon" :src="`img/me${selected=='me'?'_active':''}.png`">
        我的
      </mt-tab-item>
    </mt-tabbar>
    <!-- 发布弹出 -->
    <van-popup closeable close-icon-position="bottom-left" round v-model="popupVisible" class="bole-tab-up" position="bottom" :style="{ height: '30%' }">
      <div class="icon"  @click="toupto('v')">
        <div class="video">
          <img src="img/upvideo.png">
        </div>
        <span>发视频</span>
      </div>
      <div class="icon"  @click="toupto('p')">
        <div class="pic">
          <img src="img/uppic.png">
        </div>
        <span>发图片</span>
      </div>
      <div class="icon" @click="toupto('t')">
        <div class="txt">
          <img src="img/uptxt.png">
        </div>
        <span>发文字</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
import index from '../components/index'
import me from '../components/me'
import find from '../components/find'
import msg from '../components/msg'
export default {
  data(){
    return{
      selected:"home",
      popupVisible:false,
      show:true,
      findActive:'my'  
    }
  },

  methods: {
    upto(){//点击发布按钮
      this.popupVisible=true;
    },
    popupclose(){
      this.popupVisible=false;
    },
    toupto(type){
      //判断是否已登录
      if(!this.$store.getters.getIsLogin){
        this.$toast('请先登录')
        this.$router.push('login')
        return;
      }
      this.$router.push({
        name:'upto',
        params:{
          type
        }
      })
    }
  },
  mounted() {
    this.selected=this.$store.getters.getTable
    let isLogin = ()=>{
    //取登录状态
      this.axios.get("/getuser")
      .then(result=>{
        if(result.data.code==1){
          this.$store.commit("setUser",result.data.data);
          this.$store.commit("login")
          return;
        }
        if(result.data.code==-1){
          this.$store.commit("outlogin")
          //this.$toast("请登录")
          return;
        }
        this.$toast(result.data.msg)
      })
    } 
    isLogin()
  },
  watch: {
    selected(){
     
      this.reset()
      if(this.selected=='msg'){
        if(!this.$store.getters.getIsLogin){
          // this.$toast("请先登录");
          // this.$router.push('/login')
          // return;
        }
      }else if(this.selected=='find'){
        this.findActive="hot"
      }
      this.$store.commit("setTable",this.selected)
      
    }
  },
  components: {
    "index":index,
    "me":me,
    "find":find,
    "msg":msg
  },
}
</script>
<style scoped>

  .bole-tab-up{
    display: flex;
    justify-content:space-around;
  }
  .bole-tab-up .icon{
    margin-top: 20px;
  }
  .bole-tab-up-list{
    width: 100%;
    height: 220px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    position: absolute;
    bottom: -220px;
    display: flex;
    justify-content: space-around;
    padding-top: 40px;
    opacity: 0.3;
    transition: 1s;
  }
  .bole-tab-up-list.is-active{
    bottom: 0;
    opacity: 1;
  }
  .bole-tab-up .icon .video{
    width: 40px;height: 40px;
    border-radius: 50%;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #F95F84;
  }
  .bole-tab-up .icon .pic{
    width: 40px;height: 40px;
    border-radius: 50%;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #759CFB;
  }
  .bole-tab-up .icon .txt{
    width: 40px;height: 40px;
    border-radius: 50%;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #FBA542;
  }
  .bole-tab-up .icon img{
    width: 100%;
  }
  .bole-tab-up .icon span{
    font-size: 14px;
  }
  .mint-tabbar > .mint-tab-item.is-selected{
    background-color: #fafafa;
  }
  .upup{
    width:40px;height: 40px;
    margin: 0 10px;
    margin-top: 7px;
    
  }
  .upup img{
    width: 100%;height: 100%;
  }
</style>