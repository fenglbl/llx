<template>
  <div>
    <!-- 顶部 -->
    <van-tabs class="tabs" v-model="findactive" swipeable sticky>
      <van-tab title="我的关注" name="my">
        <!-- 未登录 -->
        <div v-if="!this.$store.getters.getIsLogin">
          <nologin></nologin>
        </div>
        <!-- 登录 -->
        <div v-else>
          <att :getatt="getatt"></att>
        </div>
      </van-tab>
      <van-tab title="热门话题" name="hot" class="hot">
        <van-sidebar v-model="hotActiveKey" class="hotsid">
          <van-sidebar-item :style="{height:hotListHeight+'px'}" v-for="(item,i) of sidList" :key="i" :title="item.groupName" :data-id="item.id" >
            {{i}}
          </van-sidebar-item>
        </van-sidebar>
        <!-- 右侧列表 -->
        <div class="hot-right">
          <!-- 一行数据 -->
          <div class="hot-list" @click="dofindlist(list.id)" v-for="(list,l) of hotTopicList" :key="l">
            <!-- 头像 -->
            <div class="hot-avatar">
              <img v-lazy="list.icon">
            </div>
            <!-- 内容 -->
            <div class="hot-desc">
              <!-- 标题 -->
              <div class="hot-title">{{list.topicName}}</div>
              <!-- 副标题 -->
              <div class="hot-subtitle">{{list.topicDesc}}</div>
            </div>
          </div>
        </div>
        <div style="height:50px;"></div>
      </van-tab>      
    </van-tabs>
    <!-- find内容列表 -->
    <div class="find-list" ref="find" :style="{left:findlistleft}">
      <findList :findheader="findheader" :titleShow='titleShow' :findlistleft="findlistleft" :doback="doback"></findList>
    </div>
  </div>
</template>
<script>
import findList from './find/findList'
import nologin from './msg/nologin'
import att from './find/att'
export default {
  components:{
    "findList":findList,
    "nologin":nologin,
    "att":att
  },
  props:{
    active:{type:String}
  },
  data(){
    return{
      hotActiveKey:0,
      findactive:'my',
      sidList:[],//左侧菜单列表
      hotTopicList:[],
      hotListHeight:0,//热门左侧高度
      findlistleft:'100%',
      findheader:{},
      titleShow:false,
      funatt(){},
    }
  },
  mounted() {
    //监听hot滚动
    this.$refs.find.addEventListener('scroll',this.findScroll)

    this.axios.jsonp(this.jsonpPostUrl,this.getPostData('http://api.cray.inf.miui.com/topic/topicGroup',{}))
    .then(res=>{
      if(res.code==200){
        this.sidList=res.data.items
        this.hotListHeight=(innerHeight-55-44)/this.sidList.length
        this.getHotList(this.sidList[0].id,(data)=>{
          this.hotTopicList=data.hotTopicList
        })
      }
    })
  },
  watch: {
    active(){
      this.findactive=this.active
    },
    hotActiveKey(){
      var groupId = this.sidList[this.hotActiveKey].id;
      this.hotTopicList=[]
      this.getHotList(groupId,(data)=>{
        this.hotTopicList=data.hotTopicList
      })
    },
    findactive(){
      if(this.findactive=='my'){
        this.funatt()
      }
    }
  },
  methods: {
    getatt(funatt){
      this.funatt=funatt
    },
    //find-hot滚动时间
    findScroll(e){
      if(this.$refs.find.scrollTop>190){
        this.titleShow=true
      }else{
        this.titleShow=false
      }
    },
    getHotList(id,callback){
      this.axios.jsonp(this.jsonpPostUrl,this.getPostData('http://api.cray.inf.miui.com/topic/getTopicByGroupId',{groupId:id}))
      .then(res=>{
        if(res.code==200){
          
          callback(res.data)
        }
      })
    },
    dofindlist(id){
      
      this.axios.jsonp('http://ka.bolefx.xyz/jsonp/get',`url=http%3a%2f%2fapi.cray.inf.miui.com%2ftopic%2fdetail%3fdata%3d%7b%22header%22%3a%7b%22token%22%3a%22%22%2c%22deviceId%22%3a%22W2aIHkEOGTgDAFS3Np5jXl%2bc%22%2c%22imeiMd5%22%3a%22%22%2c%22apkVersion%22%3a%222.1.5%22%2c%22apkChannel%22%3a%22xiaomi%22%7d%2c%22data%22%3a%7b%22topicId%22%3a%22${id}%22%7d%7d`)
      .then(res=>{
        if(res.code==200){
          this.findheader=res.data
          this.findlistleft='0';
          this.$refs.find.scrollTo(0,0)
        }else{
          this.$toast("网络错误")
        }
      })
    },
    //列表返回
    doback(){
      this.reset()
      this.findlistleft='100%';
    }
  },
}
</script>
<style scoped>
  .find-list{
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: #fff;
    left: 100%;
    transition: .5s;
    overflow: scroll;
  }
  .hot-subtitle{
    font-size: 10px;
    color: #aaa;
    font-weight: 300;
  }
  .hot-title{
    font-weight: 700;
    font-size: 14px;
    margin: 5px 0;
  }
  .hot-desc{
    margin-left: 10px;
  }
  .hot-avatar{
    height: 100%;
    width: 50px;
    border-radius: 5px;
  }
  .hot-list+.hot-list{
    margin-top: 20px;
  }
  .hot-list{
    height: 50px;
    display: flex;
    justify-content: flex-start;
    text-align: left;
  }
  .hot-list img{
    height: 100%;
    border-radius: 5px;
  }
  .hot-right{
    padding-left: 95px;
    width: 100%;
  }
  .hotsid{
    position: fixed;
    top: 44px;
  }
  .hot{
    position: relative;
  }
  .tabs{
    /* margin-right: 70%; */
  }
</style>