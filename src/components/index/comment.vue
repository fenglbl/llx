<!-- 视频或内容详情 -->
<template>
  <div class="comment">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 内容区域 -->
      <div class="count clearfix">
        <!-- 视频 -->
        <div class="pit" :style="{height:videoHeight+'px'}">
          <div class="picture" v-if="items.contentType=='PICTURE'">
            <van-grid :border="false" :column-num="3">
              <van-grid-item v-for="(pics,pi) of items.pictureInfo.pictures" :key="pi">
                <van-image :src='pics.url' />
              </van-grid-item>
            </van-grid>
          </div>
        </div>
        <div class="video" v-if="items.contentType=='VIDEO'">
          <!-- 视频图片 -->
          <div>
            <div class="video-container" :style="{background:`url('${items.videoInfo.coverUrl}') no-repeat top`,height:videoHeight+'px'}"></div>
            <!-- 背景模糊 -->
            <div class="video-background" :style="{height:videoHeight+'px'}"></div>
            <!-- 播放器 -->
            <video ref="video" :height="videoHeight" :src="items.videoInfo.url"></video>
            <!-- 进度条 -->
            <div class="v-j" ref="v_j_show">
                <div class="play" @click="play">
                  <img ref="play" src="img/index/pause.png">
                </div>
                {{v_j_val.settime}} <!-- 视频当前播放位置 -->
                <van-slider 
                  class="v-j-val"
                  v-model="v_j_val.val"
                  bar-height="2px"
                  active-color="#ee0a24"
                  @change="set_j"
                  
                />
                {{v_j_val.endtime}} <!-- 视频总长度 -->
            </div>
          </div>
          
          
        </div>
        <!-- 返回列表 -->
          <div @click="toReturn" class="return">
            <van-icon name="arrow-left" />
          </div>
        <!-- 用户区域 -->
        <div class="user" :data-userId="items.author.userId">
          <!-- 用户信息 -->
          <div class="user-head">
            <!-- 头像昵称 -->
            <div class="user-avatar">
              <div><img v-lazy="items.author.authorAvatarUrl"></div>
              <div class="user-name">{{items.author.authorName}}</div>
            </div>

            <!-- 关注 -->
            <van-button 
              round 
              :plain="doAttUser" 
              hairline 
              :style="{color:doAttUser?'#000':'#fff'}" 
              :color="doAttUser?'#000':'#FE698D'" 
              size="small" 
              @click="attuser"
            >{{doAttUser?"已关注":"关注"}}</van-button>
          </div>
          <div class="user-desc">
            {{items.videoInfo?items.videoInfo.desc:items.pictureInfo.desc}}
          </div>
        </div>
      </div>
      <!-- 评论内容 bestComment-->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="我也是有底线的……"
        @load="onLoad"
      >
        <div class="comments" v-show="commentList.length>0">
          <!-- 判断有没有评论 -->
          <div v-if="commentList.length>0">
            <!-- 评论列表 -->
            <div class="list" v-for="(comment,c) of commentList" :key="c">
              <!-- 评论用户名 -->
              <div class="author">
                <!-- 头像 avatar -->
                <div class="avatar">
                  <img v-lazy="comment.author.authorAvatarUrl">
                </div>
                <div class="desc">
                  <!-- 昵称 name -->
                  <div class="name">
                    {{comment.author.authorName}}
                  </div>
                  <!-- 时间 -->
                  <div class="time">
                    {{getCommentTime(comment.createTime)}}
                  </div>
                </div>

                <!-- 神评论 godCommentDetail -->
                <div class="godCommentDetail">
                    <img v-show="comment.godCommentDetail.type==2" src="img/video/godCommentDetail.png">
                </div>
              </div>
              <!-- 评论内容 -->
              <div class="comment-info">
                <!-- 文本内容 -->
                <div class="desc">
                  {{comment.textCommentInfo.content}}
                </div>
                <!-- 视频内容 -->
                <div class="video">
                  <!-- 判断是否为视频 -->
                  <div v-if="comment.videoCommentInfo.videos.length>0">
                    这里是视频
                  </div>
                </div>
                <!-- 图片内容 -->
                <div class="pics">
                  <!-- 判断是否为图片 -->
                  <div class="ispic" v-if="comment.pictureCommentInfo.pictures.length>0">
                    <div class="pic" v-for="(pic,p) of comment.pictureCommentInfo.pictures" :key="p">
                      <img :style="{height:commentPicHeight }" @click="commentImagePreview"  :data-id="p" v-lazy="pic.url">
                    </div>
                  </div>
                </div>
                <!-- 评论点赞 -->
                <div class="praise">
                  <div>{{comment.likeCount}}</div>
                  <van-icon name="good-job-o" />
                  <!-- 点击后效果 <van-icon name="good-job" color="#FE698D"/> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  props:{
    commentData:{type:Object},
    decomment:{type:Function}
  },
  data(){
    return{
      value:'',
      isLoading: false,
      commentList:[],
      commentPicHeight:(innerWidth-50)*0.26+"px",
      after:0,
      finished:false,
      loading:true,
      videoWidth:this.$refs.video,
      lid:'',
      items:{author:{},videoInfo:{}},
      video:{},
      v_j_val:{val:0,settime:0,endtime:0},//进度条数据，val视频百分比，settime为当前播放到的时间，endtime为视频总长度
      videoHeight:300,//播放区域高度
      doAttUser:false,//用户是否被关注
    }
  },
  watch: {
    commentData(){
      
      scrollTo(0,0)
      this.loading=false;
      var playTime = this.commentData.playTime
      this.items=this.commentData.items
      // console.log(this.items)
      this.isAttUser()
      this.lid=this.items.id;
      this.after=0;
      this.finished=false;
      this.getData('list',this.lid,this.after,data=>{
        if(data.length==0){
          this.finished=true;
          return;
        }
        
        if(this.items.contentType=='VIDEO'){
          this.video=this.$refs.video
          var playImg=this.$refs.play 
          this.video.onplay=()=>{
            playImg.src="img/index/pause.png"
          }
          this.video.play();
          this.video.currentTime=playTime
          this.commentList=data
          this.video.ontimeupdate=()=>{//播放进度改变事件
            this.v_j_val.val=(this.video.currentTime*100)/this.video.duration;
            this.v_j_val.settime=this.setTimer(this.video.currentTime);
            this.v_j_val.endtime=this.setTimer(this.video.duration);
          }
          this.video.onended=()=>{
              
            playImg.src="img/index/play.png"
          }
        }
      })
    
    }
  },
  methods: {
    //关注用户
    attuser(){
      //在未关注的情况下才能点击
      if(!this.doAttUser){
        let userId = this.items.author.userId
        let headUrl = this.items.author.authorAvatarUrl
        let nickname = this.items.author.authorName
        let sex = '未知'
        let data = JSON.stringify({userId,headUrl,nickname,sex})
        data=this.qs.stringify({data})
        this.axios.post('/adduser',data)
        .then(res=>{
          if(res.data.code==1){
            this.isAttUser()
          }else if(res.data.code==-100){
            this.$toast('请先登录')
            this.$router.push('/login')
          }else{
            this.$toast('关注失败')
          }
        })
      }
    },
    //用户是否已关注
    isAttUser(){
      let ids = [this.items.author.userId]
      ids=JSON.stringify(ids)
      this.axios.get("/getattuser",{params:{userIds:ids}})
      .then(res=>{
        if(res.data.code==1){
          //已关注
          this.doAttUser=true
        }else{
          //未关注
          this.doAttUser=false
        }
      })
      return false;
    },
    onRefresh() {//下拉刷新
      setTimeout(() => {
        this.isLoading = false;
        this.after=0;
        this.getData('list',this.lid,this.after,data=>{
          if(data.length==0){
            this.finished=true;
            return;
          }
          this.commentList=data
        })
      }, 500);
    },
    onLoad() {//上啦加载
      // 异步更新数据
        setTimeout(() => {
          this.after++;
          this.getData('list',this.lid,this.after,data=>{
            this.loading=false; 
            if(data.length==0){
              this.finished=true;
              return;
            }
            this.commentList=this.commentList.concat(data)  
          })
        }, 500);
        
      },
    //axios获取数据
    getData(type,vid,after,fn){//定义获取数据函数
      //提交数据
      this.$indicator.open('加载中...');
      this.axios.jsonp(this.jsonpPostUrl,this.getPostData(`http://api.cray.inf.miui.com/comment/${type}`,{contentId:vid,feedDetailEntranceType:2,after}))
      .then(res=>{
        fn(res.code==200?res.data.items:null);
        this.$indicator.close();
        this.reset()
      })
    },
    commentImagePreview(e){//点击评论图片事件，实现图片预览
      var picList=e.target.parentNode.parentNode.querySelectorAll('.pic>img')
      var pics=[]
      for(var pic of picList){
        pics.push(pic.src)
      }
      var id=e.target.dataset.id
      this.ImagePreview({
        images:pics,
        startPosition: parseInt(id),
        loop:false,
      });
    },
    getCommentTime(timer){//修改时间格式，将数据库返回的时间戳转换成规定的格式
      var time;
      time=timer?timer:''
      var nowTime = new Date().getTime();
      var _t=nowTime-time;
      if(_t>3600*24*2){
        time=new Date(time).format('MM-dd');
        return time;
      }
      if(_t>3600*24){
        return '昨天';
      }
      if(_t>60){
        time=new Date(time).format('hh:mm');
        return time;
      }
      return '刚刚';
    },
    toReturn(){//返回上一页面
      this.reset()
      typeof this.video.pause=='function'&&this.video.pause()
      var comment = $(".v-comment")
      this.commentList=[]
      comment.css({
        position:"fixed",
        left:"130%"
        })
      this.decomment()
    },
    set_j(v){//修改播放进度
      var video=this.$refs.video
      video.currentTime=(v*video.duration)/100
    },
    play(){//播放暂停
      var video=this.$refs.video
      var playImg=this.$refs.play
      if(video.paused){
        video.play()
        playImg.src="img/index/pause.png"
      }else{
        video.pause()
        playImg.src="img/index/play.png"
      }
    }
  },
}
</script>
<style scoped>
  /* 用户 */
  .user-desc{
    margin-top: 8px;
    text-align: left;
    padding-bottom: 8px;
    padding: 0 8px 8px;
  }
  .user-name{
    line-height: 44px;
  }
  .user-avatar img{
    border-radius: 50%; 
  }
  .user-avatar>div:first-child{
    height: 28px;width: 28px;
    padding: 8px;
    
  }
  .user-avatar{
    display: flex;
  }
  .user-head{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .user{
    background-color: #fff;
    padding: 0 15px;
    border-bottom: 2px solid #eee;
  }
  /* 视频图片 */
  .video-container{
    opacity: 0.9;
    filter: blur(40px);
  }
  .play{
    width: 16px;height: 16px;
    padding: 5px;
  }
  .v-j{
    position: absolute;
    z-index: 1;
    bottom: 20px;
    width: 80%;
    margin: 0 10% ;
    transition: 0.5s;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    align-items: center;
  }
  .v-j .v-j-val{
    width: 65%

  }
  .comment .return{
    position: fixed;
    top: 20px;
    margin-left: 20px;
    font-size: 34px;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.3);
    width: 40px;height: 40px;
    z-index: 2;
    border-radius: 50%;
    display: flex;
    align-items: center;
  }
  .comment .count .video .video-background{
    width: 100%;
    position: absolute;
    background: #333333;
    left: 0;
    top: 0;
    z-index: -1;
  }
  .comment .count video{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .comment .count .video>div:first-child{
    position: relative;
  }
  .comment .count .video{
    position: fixed;
    top: 0;
    /* left: 0; */
    width: 100%;
    z-index: 2;
    text-align: center;
  }
  .comment .comment-info .ispic{
    display: flex;
    flex-wrap: wrap;
  }
  .comment .comment-info .pic{
    width:28%;
    margin: 5px 2.5px;
  }
  .comment .comment-info .pics{
    display: flex;
    flex-wrap: wrap;
  }
  .comment .comment-info .praise>div{
    color: #999;
    margin-right: 5px;
  }
  .comment .comment-info .praise{
    display: flex;
    width: 50px;
    justify-content: flex-end;
    font-size: 12px;
    position: absolute;
    top: 5px;
    right: 0;
  }
  .comment .comment-info .desc{
    font-size: 14px;
    padding-right: 50px;
  }
  .comment .comment-info{
    position: relative;
  }
  .comment .author .godCommentDetail{
    position: absolute;
    top: -20px;right: -5px;
  }
  .comment .author .time{
    font-size: 12px;
    padding-left: 10px;
    color: #999;
  }
  .comment .author .name{
    padding-left: 10px;
    color: #111;
    font-size: 13px;
  }
  .comment .author .avatar img{border-radius: 50%;}
  .comment .author .avatar{
    width: 26px;height: 26px;
    border-radius: 50%;
  }
  .comment .author{
    height: 36px;
    position: relative;
    display: flex;
    justify-content: start ;
    align-items: flex-start;
  }
  .comment .list{
    border-top: 1px solid #eee;
    padding: 5px 0;
    margin: 0 15px;
  }
  .comment{
    text-align: left;
  }
  .comments{
    margin: 10px auto;
    margin-bottom: 0;
    padding: 10px 0 0 0;
  }
</style>