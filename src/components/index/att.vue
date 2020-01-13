<template>
  <div class="att">
    <!-- 未登录状态 -->
    <div v-if="!this.$store.getters.getIsLogin">
      <!-- 顶部登录按钮和其他提示 -->
      <div class="att-head">
        <div class="att-head-content">
          <div class="att-head-img">
            <img src="img/login/nologin.png">
          </div>
          <div class="att-head-desc">
            <div class="att-head-title">
              登录后，才能查看你的内容
            </div>
            <div class="att-head-btn">
              <van-button type="primary" color="#FE698D" round size="small" @click="attDoLoin">去登录</van-button>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
    <!-- 登录状态 -->
    <div v-else>
    </div>
    <!-- find内容列表 -->
    <div class="find-list" ref="att" :style="{left:findlistleft}">
      <findList :findheader="findheader" :titleShow='titleShow' :findlistleft="findlistleft" :doback="doback"></findList>
    </div>
    <div class="att-find-no">
        <!-- 推荐话题 -->
        <h5 class="att-title-no">推荐话题</h5>
        <div class="att-item-no" @click="dofindlist($event,itemT.id,iT)" v-for="(itemT,iT) of hotTopic" :key="'T'+iT" :data-id='itemT.id'>
          <div class="att-item-r-no">
            <van-image class="att-item-r-img-no noround" height="100%" fit="fill" :src="itemT.icon "/>
            <div class="att-item-r-desc-no">
              <div class="title">{{itemT.topicName}}</div>
              <div class="subtitle">{{itemT.topicDesc}}</div>
            </div>
          </div>
          <van-button type="primary"  round :plain='isatt[itemT.id]' hairline :color="isatt[itemT.id]?'#000000':'#FE698D'" size="mini" class="fl-head-btn">{{isatt[itemT.id]?"已关注":"关注"}}</van-button>
        </div>
        <!-- 推荐用户 -->
        <h5 class="att-title-no">推荐用户</h5>
        <div class="att-item-no" v-for="(itemV,iV) of hotVipUser" :key="'V'+iV">
          <div class="att-item-r-no">
            <van-image round class="att-item-r-img-no" height="100%" fit="fill" :src="itemV.headUrl"/>
            <div class="att-item-r-desc-no">
              <div class="title">{{itemV.nickname}}</div>
              <div class="subtitle">粉丝:{{itemV.likedCount}}</div>
            </div>
          </div>
          <!-- 关注 -->
          <van-button 
            round 
            :plain="doAttUser[itemV.userId]" 
            hairline 
            :style="{color:doAttUser[itemV.userId]?'#000':'#fff'}" 
            :color="doAttUser[itemV.userId]?'#000':'#FE698D'" 
             size="mini"
            @click="attuser(iV)"
          >{{doAttUser[itemV.userId]?"已关注":"关注"}}</van-button>
        </div>
      </div>
  </div>
</template>
<script>
import findList from '../find/findList'
export default {
  //注册组件
  components:{
    "findList":findList
  },
  //数据
  data() {
    return {
      hotTopic:[],
      hotVipUser:[],
      findlistleft:'100%',
      findheader:{},
      titleShow:false,
      isatt:{},
      doAttUser:{}
    }
  },
  //声明周期-挂载完成
  mounted(){
    //监听hot滚动
    this.$refs.att.addEventListener('scroll',this.attScroll)
    this.axios.jsonp(this.jsonpPostUrl,this.getPostData(`http://api.cray.inf.miui.com/recommend/hotTag`,{}))
    .then(res=>{
      if(res.code==200){
        this.hotTopic = res.data.hotTopic
        //取关注状态列表
        this.gethotatt(this.hotTopic)
        this.hotVipUser = res.data.hotVipUser
        this.getattuser(this.hotVipUser)
        // console.log(this.hotVipUser)
      }
    })
    //
  },
  //方法
  methods: {
    //取关注状态列表
    gethotatt(list){
      let ids = JSON.stringify(list.map(val=>{
        return val.id
      }))
      this.axios.get("/getatt",{params:{ids}})
      .then(res=>{
        if(res.data.code==1){
          //已关注
          this.isatt={}
          for(var item of res.data.data){
            this.isatt[item.id]=true
          }
        }else{
          //未关注
          this.isatt={}
        }
      })
    },
    //取关注用户列表
    getattuser(list){
      let ids = JSON.stringify(list.map(val=>{
        return val.userId
      }))
      // ids=JSON.stringify(ids)
      this.axios.get("/getattuser",{params:{userIds:ids}})
      .then(res=>{
        if(res.data.code==1){
          //已关注
          this.doAttUser={}
          for(var item of res.data.data){
            this.doAttUser[item.userId]=true
          }
        }else{
          //未关注
          this.doAttUser={}
        }
      })
    },
    //关注用户
    attuser(id){
      //在未关注的情况下才能点击
      let userId = this.hotVipUser[id].userId
      if(!this.doAttUser[userId]){
        let headUrl = this.hotVipUser[id].headUrl
        let nickname = this.hotVipUser[id].nickname
        // console.log(userId)
        // return;
        let sex = '未知'
        let data = JSON.stringify({userId,headUrl,nickname,sex})
        data=this.qs.stringify({data})
        this.axios.post('/adduser',data)
        .then(res=>{
          if(res.data.code==1){
            this.doAttUser[userId]=true
            this.getattuser(this.hotVipUser)
          }else if(res.data.code==-100){
            this.$toast('请先登录')
            this.$router.push('/login')
          }else{
            this.$toast('关注失败')
          }
        })
      }
    },
    //find-hot滚动时间
    attScroll(e){
      if(this.$refs.att.scrollTop>190){
        this.titleShow=true
      }else{
        this.titleShow=false
      }
    },
    //去登录
    attDoLoin(){
      this.$router.push("/login")
    },
    //返回
    doback(){
      this.findlistleft='100%';
    },
    //列表
    dofindlist(e,id,it){
      if(e.target.nodeName=='BUTTON'){
        //在未关注的情况下才能点击
        if(!this.isatt[id]){
          let id = this.hotTopic[it].id
          let icon = this.hotTopic[it].icon
          let topicName = this.hotTopic[it].topicName
          let topicDesc = this.hotTopic[it].topicDesc
          let data = JSON.stringify({id,icon,topicName,topicDesc})
          data=this.qs.stringify({data})
          this.axios.post('/addatt',data)
          .then(res=>{
            if(res.data.code==1){
              this.gethotatt(this.hotTopic)
            }else if(res.data.code==-100){
              this.$toast('请先登录')
              this.$router.push('/login')
            }else{
              this.$toast('关注失败')
            }
          })
        }
        return;
      }
      this.axios.jsonp('http://ka.bolefx.xyz/jsonp/get',`url=http%3a%2f%2fapi.cray.inf.miui.com%2ftopic%2fdetail%3fdata%3d%7b%22header%22%3a%7b%22token%22%3a%22%22%2c%22deviceId%22%3a%22W2aIHkEOGTgDAFS3Np5jXl%2bc%22%2c%22imeiMd5%22%3a%22%22%2c%22apkVersion%22%3a%222.1.5%22%2c%22apkChannel%22%3a%22xiaomi%22%7d%2c%22data%22%3a%7b%22topicId%22%3a%22${id}%22%7d%7d`)
      .then(res=>{
        if(res.code==200){
          this.findheader=res.data
          this.findlistleft='0';
          this.$refs.att.scrollTo(0,0)
        }else{
          this.$toast("网络错误")
        }
      })
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
  .att-item-r-desc-no .subtitle{
    font-size: 12px;
    color: #bbb;
    margin-top: 8px;
  }
  .att-item-r-desc-no .title{
    font-size: 16px;
    font-weight: 700;
    margin-top: 8px;
  }
  .att-item-r-desc-no{
    margin-left: 8PX;
  }
  .att-item-r-img-no.noround{
    border-radius: 5px;
  }
  .att-item-r-img-no{
    width: 60px;
    overflow: hidden;
  }
  .att-item-r-no{
    height: 100%;
    display: flex;
  }
  .att-item-no+.att-item-no{
    margin-top: 5px;
  }
  .att-item-no{
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .att-title-no{
    padding: 10px 0;
    margin: 0;
    background-color: #fff;
  }
  .att-find-no{
    margin: 0 10px;
  }
  .att-head-btn{
    margin-top: 8px;
  }
  .att-head-title{
    font-size: 14px;
    color: #bbb;
  }
  .att-head-desc{
    margin-left: 10px;
  }
  .att-head-img{
    width: 88px;height: 88px;
  }
  .att-head-content{
    display: flex;
    align-items: center;
  }
  .att-head{
    width: 100%;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .att{
    background-color: #fff; 
    text-align: left;
  }
</style>