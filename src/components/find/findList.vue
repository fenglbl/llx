<template>
  <div class="findList">
    <!-- 下拉加载 -->
    <div>
      <van-list
        v-model="findloading"
        :finished="findfinished"
        finished-text="我也是有底线的"
        @load="findonLoad"
        :immediate-check='false'
        
      >
        <!-- 头信息 -->
        <div class="fl-head">
          <!-- 背景图片 -->
          <div class="fl-head-img">
            <img :src="findheader.background">
          </div>
          <div class="fl-bg">

          </div>
          <!-- 标题 -->
          <div class="fl-title">
            {{findheader.topicName}}
          </div>
          <!-- 副标题 -->
          <div class="fl-subtitle">
            {{findheader.topicDesc}}
          </div>
          <!-- 关注人数 -->
          <div class="fl-gz">
            {{findheader.fansNum}}人关注
          </div>
          <!-- 关注按钮 -->
          <van-button @click="addatt" type="primary" round size="mini" :style="{color:isAtt?'#000':'#fff'}" :color="isAtt?'#fff':'#FE698D'" class="fl-btn">{{isAtt?"已关注":"关注"}}</van-button>
          
          <!-- 返回上一页 -->
          <div class="fl-back" @click="doback">
            <van-icon name="arrow-left" />
          </div>
        </div>
        
        <!-- 头部标题 -->
        <div v-show="titleShow" class="fl-head-title">
          <!-- 返回按钮 -->
          <div class="fl-head-back" @click="doback">
            <van-icon name="arrow-left" />
          </div>
          <!-- 头像 -->
          <div class="fl-avatar">
            <img :src="findheader.icon">
          </div>
          <!-- 标题 -->
          <div class="fl-head-desc">
            {{findheader.topicName}}
          </div>
          <!-- 关注按钮 -->
          <van-button @click="addatt" type="primary" :plain='isAtt' hairline :color="isAtt?'#000':'#FE698D'" round size="mini" class="fl-head-btn">{{isAtt?"已关注":"关注"}}</van-button>
        </div>
        
        <!-- 头部导航栏 -->
        <div class="fl-tabs">
            <van-tabs v-model="findListActive" swipeable :class="{'active-fixed':titleShow}">
              <van-tab title="热门" name='hot'>
                <!-- 加载中图片 -->
                <div class="fl-loading" v-show="!datalist.hot.length">
                  <img src="img/loading.gif">
                </div>
                <videos class="video" v-for="(items,i) of datalist.hot" :key="i" :items="items" :comment="comment" type='videoList'></videos>
              </van-tab>
              <van-tab title="最新" name='new'>
                <!-- 加载中图片 -->
                <div class="fl-loading" v-show="!datalist.new.length">
                  <img src="img/loading.gif">
                </div>
                <videos class="video" v-for="(items,i) of datalist.new" :key="i" :items="items" :comment="comment" type='videoList'></videos>
              </van-tab>
            </van-tabs>
        </div>
      <!-- 内容列表 -->
      </van-list>
    </div>

    <!-- 详细内容列表 -->
    <div class="v-comment" :style="{left:comleft}">
      <comment :commentData="commentData" :decomment="decomment"></comment>
    </div>
  </div> 
</template>
<script>
import video from '../index/video'
import comment from '../index/comment'
export default {
  props:{
    findheader:{type:Object},
    doback:{type:Function},
    findlistleft:{type:String},
    titleShow:{type:Boolean},
  },
  data(){
    return{
      findListActive:'new',
      hotVideoList:[],
      findloading: false,
      findfinished: false,
      pg:{
        hot:0,
        new:0
      },
      datalist:{
        hot:[],
        new:[]
      },
      isAtt:false,
      comleft:'130%',
      commentData:{},
      islistshow:true
    }
  },
  watch:{
    //监听详细列表的位置
    findlistleft(){
      if(this.findlistleft=="100%"){
        this.findListActive="0"
      }
    },
    //头信息接收到信息
    findheader(){
      this.findListActive='hot'
      this.datalist.hot=[]
      this.idDoAtt()
    },
    //监听分类变更
    findListActive(){
      this.pg[this.findListActive]=0
      this.datalist[this.findListActive]=[]
      this.getlist(this.findheader.id,this.pg[this.findListActive],this.findListActive,data=>{
        this.datalist[this.findListActive]=data.data.items
      })
    }
  },
  mounted(){

  },
  methods:{
    //详情页返回被点击
    decomment(){
      this.comleft="130%"
      this.islistshow=true
    },
    //是否关注
    idDoAtt(){
      let ids = JSON.stringify([this.findheader.id])
      this.axios.get("/getatt",{params:{ids}})
      .then(res=>{
        if(res.data.code==1){
          //已关注
          this.isAtt=true
        }else{
          //未关注
          this.isAtt=false
        }
      })
    },
    //点击关注
    addatt(){
      //在未关注的情况下才能点击
      if(!this.isAtt){
        let id = this.findheader.id
        let icon = this.findheader.icon
        let topicName = this.findheader.topicName
        let topicDesc = this.findheader.topicDesc
        let data = JSON.stringify({id,icon,topicName,topicDesc})
        data=this.qs.stringify({data})
        this.axios.post('/addatt',data)
        .then(res=>{
          if(res.data.code==1){
            this.idDoAtt()
          }else if(res.data.code==-100){
            this.$toast('请先登录')
            this.$router.push('/login')
          }else{
            this.$toast('关注失败')
          }
        })
      }
    },
    //
    comment(data){
      this.commentData=data
      this.comleft="0"
      this.islistshow=false
    },
    //
    findonLoad() {
      // 异步更新数据
      let timer = setTimeout(() => {
        this.pg[this.findListActive]++
        this.getlist(this.findheader.id,this.pg[this.findListActive],this.findListActive,data=>{
          // 数据全部加载完成
          if (data.data.items.length == 0 ) {
            this.findfinished = true;
          }
          this.datalist[this.findListActive]=this.datalist[this.findListActive].concat(data.data.items)
          // 加载状态结束
          this.findloading = false;
          clearTimeout(timer)
        })
      }, 500);
    },
    getlist(id,pg,type,callback){
      this.axios.jsonp(this.jsonGetUrl,`url=http://api.cray.inf.miui.com/content/contentByTopic?data=%7B%22header%22%3A%7B%22token%22%3A%22%22%2C%22deviceId%22%3A%22W2aIHkEOGTgDAFS3Np5jXl%2Bc%22%2C%22imeiMd5%22%3A%22%22%2C%22apkVersion%22%3A%222.1.5%22%2C%22apkChannel%22%3A%22xiaomi%22%7D%2C%22data%22%3A%7B${type=='hot'?'%22recType%22%3A%222%22%2C':''}%22topicId%22%3A%22${id}%22%2C%22after%22%3A%220%22%2C%22pageNum%22%3A%22${pg}%22%7D%7D`)
      .then(res=>{
        if(res.code==200){
          callback(res)
        }else{
          this.$toast("网络错误")
        }
        
      })
    }
  },
  filters:{//管道
    
  },
  components:{
    "videos":video,
    "comment":comment
  }
}
</script>
<style scoped>
  .v-comment{
    position: fixed;
    z-index: 1002;
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #fff;
    transition: .5s;
    overflow-y: scroll;
  }
  .fl-loading>img{
    width: 25px;height: 25px;
  }
  .fl-loading{
    width: 100%;
    height: 40px;
    margin-top: 20px;
    text-align: center;
  }
  .fl-head-btn{
    position: absolute;
    top: 8px;
    right: 20px;
  }
  .fl-head-desc{
    line-height: 40px;
    text-align: left;
    font-size: 14px;
    position: absolute;
    left: 90px;
  }
  .fl-head-back{
    position: absolute;
    top: 0px;left: 0px;
    display: flex;
    align-items: center;
    font-size: 24px;
    color: #111;  
    width: 40px;
    height: 40px;
    padding-left: 8px;
  }
  .fl-avatar{
    width: 24px;height: 24px;
    position: absolute;
    left: 45px;
    border-radius: 50%;
    overflow: hidden;
    margin: 8px;
  }
  .fl-head-title{
    position: fixed;
    top:0;
    background-color: #fff;
    width: 100%;height: 40px;
    z-index: 100;
  }
  .fl-btn{
    position: absolute;
    bottom: 40px;right: 20px;
  }
  .fl-gz{
    font-size: 13px;
    color: #fff;
    position: absolute;
    top: 140px;left: 20px;
  }
  .fl-subtitle{
    font-size: 13px;
    color: #eee;
    position: absolute;
    top: 120px;left: 20px;
  }
  .fl-title{
    font-size: 20px;
    color: #eee;
    position: absolute;
    top: 90px;left: 20px;
    font-weight: 700;
  }
  .fl-bg{
    width: 100%;
    height: 199.85px;
    position: absolute;
    top: 0;
    background-color: rgba(0, 0, 0, .2)
  }
  .fl-tabs{
    position: relative;
    top: -20px;
    overflow: scroll;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .fl-head-img img{
    width: 100%;
    height: 100%;
  }
  .fl-head-img{
    width: 100%;
    height: 199.85px;
  }
  .fl-head{
    position: relative;
  }
  .fl-back{
    position: absolute;
    top: 15px;left: 15px;
    display: flex;
    align-items: center;
    font-size: 24px;
    color: #eee;  
    width: 40px;
    height: 40px;
  }
</style>