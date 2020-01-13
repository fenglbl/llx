<template>
  <div class="videos" ref="videos" :data-lid="items.id" @click="toComment">
    <div class="nav">
      <!-- 用户名头像 -->
      <div class="head">
        <div class="pic">
          <!-- <img v-lazy="items.author.authorAvatarUrl"> -->
          <van-image round width="40px" height="40px" :src="items.author.authorAvatarUrl">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error>加载失败</template>
          </van-image>
        </div>
        <div class="user_name">
          <div class="title">{{items.author.authorName}}</div>
          <div>优质内容供应者</div>
        </div>
      </div>
      <div class="body">
        <!-- 文字内容 share-->
        <div class="text">
          {{items.contentType=='TEXT'?items.share.subtitle:(items.contentType=='VIDEO'?items.videoInfo.desc:items.pictureInfo.desc)}}
        </div>
        <!-- 视频内容 videoInfo 视频壁纸(coverUrl)-->
        <div class="videoInfo" v-if="items.contentType!='TEXT'">
          <div v-if="items.contentType=='VIDEO'" class="vdo"  :style="{height:`${(items.videoInfo.height*innerWidth)/items.videoInfo.width}px`}">
            <!-- 播放器 -->
            <video preload="none" @canplaythrough="canplay" @play="setPlay" @click="v_click" ref="video" class="v videoLazyLoad" :class="type" :id="items.id" :src="items.videoInfo.url" ></video>
            <!-- 播放进度条 -->
            <div class="v-j" ref="v_j_show">
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
            <!-- 视频背景图 -->
            <img v-lazy="items.videoInfo.coverUrl"  ref='vodBg' class="bg" style="width:100%;">
            <!-- 播放暂停按钮 -->
            <div ref="play" style="opacity: 1;" class="play" @click="play">
              <img src="img/index/play.png">
            </div>
            <!-- 重播分享面板 -->
            <div class="shares" v-show="share_show" :data-show="share_show">
              <div class="share">
                <van-divider :style="{color:'#fff',borderColor:'#fff',padding:'0 30%' }">
                  分享到
                </van-divider>
                <div class="icon">
                  <!-- 微信好友 -->
                  <div>
                    <img src="img/video/WH.png">
                    微信
                  </div>
                  <!-- 盆友圈 -->
                  <div>
                    <img src="img/video/COF.png">
                    朋友圈
                  </div>
                  <!-- QQ好友 -->
                  <div>
                    <img src="img/video/QQ.png">
                    QQ
                  </div>
                  <!-- QQ空间 -->
                  <div>
                    <img src="img/video/Qzone.png">
                    QQ空间
                  </div>
                </div>
                <div class="share-btn">
                  <!-- rebroadcast重播 按钮 -->
                  <van-button @click="rebroadcast" style="margin:0 auto;" size="mini" icon="replay" round plain color="#fff" type="info">重播</van-button>
                </div>
              </div>
            </div>
          </div>
          <!-- 图片 -->
          <div v-else class="pic" :id="items.id">
            <div class="pic-list" :style="{width:setWidth(items.pictureInfo.pictures,pics.width,pics.height,p),height:picsHeight}" v-for="(pics,p) of items.pictureInfo.pictures" :key="p" >
              <img  class="noimg" :style="{width:imgwidth[p],height:imgheight[p]}" @click="imagePreview(p)" v-lazy="pics.url" :data-id="p">
            </div>
          </div>
        </div>      
        <!-- 评论内容 bestComment-->
        <div class="comment" v-show="items.bestComment.length>0">
          <!-- 判断有没有评论 -->
          <div v-if="items.bestComment.length>0">
            <!-- 评论列表 -->
            <div class="list" v-for="(comment,c) of items.bestComment" :key="c">
              <!-- 评论用户名 -->
              <div class="author">
                <!-- 头像 avatar -->
                <div class="avatar">
                  <img v-lazy="comment.author.authorAvatarUrl">
                </div>
                <!-- 昵称 name -->
                <div class="name">
                  {{comment.author.authorName}}
                </div>
                <!-- 神评论 godCommentDetail -->
                <div class="godCommentDetail">
                    <img src="img/video/godCommentDetail.png">
                </div>
              </div>
              <!-- 评论内容 -->
              <div class="comment-info">
                <!-- 文本内容 -->
                <div class="comment-desc desc">
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
                    <!-- 图片列表 -->
                    <div class="pic" v-for="(pic,p) of comment.pictureCommentInfo.pictures" :key="p">
                      
                        <img :style="{height:commentPicHeight}" @click="commentImagePreview(c,p)"  :data-id="p" v-lazy="pic.url">
                    </div>
                  </div>
                </div>
                <!-- 评论点赞 -->
                <div class="praise">
                  <div class="desc">{{comment.likeCount}}</div>
                  <van-icon name="good-job-o" />
                  <!-- 点击后效果 <van-icon name="good-job" color="#FE698D"/> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <!-- 赞(likeCount)踩(dislikeCount)评论(commentCount)分享(shareCount) -->
      <div class="foot">
        <!-- 赞 -->
        <div class="like-count btn" @click="likeCount">
            <img ref="like" class="icon" src="img/video/like.png">
            <div class="desc">{{items.likeCount}}</div>
        </div>
        <!-- 踩 -->
        <div class="dislike-count btn">
          <img class="icon" src="img/video/dislike.png">
          <div class="desc">{{items.dislikeCount}}</div>
        </div>
        <!-- 评论 -->
        <div class="comment-count btn">
          <img class="icon icon-comment" src="img/video/comment.png">
          <div class="desc desc-comment">{{items.commentCount}}</div>
        </div>
        <!-- 分享 -->
        <div class="share-count btn">
          <img class="icon" src="img/video/share.png">
          <div class="desc">{{items.shareCount}}</div>
        </div>
      </div>
    </div>

    
  </div>
</template>
<script>

  export default {
    props:{//父组件传参
      items:{type:Object},//每个视频或者图片的对象数据
      type:{type:String},//加载类型
      comment:{type:Function},//向父元素传参
    },
    data() {//定义数据
      return {
        innerWidth:innerWidth,//窗口宽度，计算播放器的宽高比
        v_j_val:{val:0,settime:0,endtime:0},//进度条数据，val视频百分比，settime为当前播放到的时间，endtime为视频总长度
        share_show:false,//初始分析功能，默认为隐藏
        picsHeight:'',//设置图片的高度
        commentPicHeight:(innerWidth-50)*0.26+"px",
        imgwidth:{},
        imgheight:{}
      }
    },
    mounted(){//组件加载完成事件
    
    },
    methods: {//定义函数
      canplay(e){//视频可以播放事件,视频加载成功事件
        if(e.target.readyState==4){
          this.reset()
          setTimeout(()=>{
            if(!this.share_show){
              e.target&&e.target.play()
              
            }
          },1000)
        }
        console.log(this.items)
      },
      setPlay(){//视频开始播放事件，为video的事件，事件进度条等的初始化
        var video=this.$refs.video
        var vodBg=this.$refs.vodBg
        var playBtn=this.$refs.play
        var playBtnImg=playBtn.querySelector('img')
        var v_j_show=this.$refs.v_j_show
        vodBg.style.display="none";
        playBtnImg.src='img/index/pause.png'
        v_j_show.style.opacity=1
        
        setTimeout(()=>{
          playBtn.style.opacity=0
          v_j_show.style.opacity=0
        },2000)
        video.ontimeupdate=()=>{
          this.v_j_val.val=(video.currentTime*100)/video.duration;
          this.v_j_val.settime=this.setTimer(video.currentTime);
          this.v_j_val.endtime=this.setTimer(video.duration);
        }
        video.onended=()=>{//视频播放完毕事件
          playBtnImg.src='img/index/play.png'
          this.share_show=true
        }
        video.onwaiting=()=>{
          console.log('缓冲中')
        }
      },
      play(){//播放按钮，实现点击按钮播放和暂停功能
        var playBtn=this.$refs.play
        var playBtnImg=playBtn.querySelector('img')
        var video=this.$refs.video
        var vodBg=this.$refs.vodBg
        var v_j_show=this.$refs.v_j_show
        if(playBtn.style.opacity==0){
          playBtn.style.opacity=1
          this.$refs.v_j_show.style.opacity=1
          return;
        }
        if(video.paused){
          this.reset()
          if(this.v_j_val.val!=0){
            video.play()
          }else{
            playBtnImg.src='img/video/loading.gif'
            video.load()
          }
        }else{
          video.pause()
          playBtnImg.src='img/index/play.png'
        }
        
      },
      v_click(){//点击video标签事件，实现按钮和进度条的显示和隐藏
        var playBtn=this.$refs.play
        var v_j_show=this.$refs.v_j_show
        if(playBtn.style.opacity==0){
          playBtn.style.opacity=1
          v_j_show.style.opacity=1
          setTimeout(()=>{
            playBtn.style.opacity=0
            v_j_show.style.opacity=0
          },3000)
        }else{
          playBtn.style.opacity=0
          v_j_show.style.opacity=0
        }
        
      },
      set_j(v){//修改进度条事件,实现拖动修改视频进度功能
        var video=this.$refs.video
        video.currentTime=(v*video.duration)/100
      },
      imagePreview(id){//点击图片事件，实现预览功能
        let pics = this.items.pictureInfo.pictures
        this.preview(pics,'url',id)
      },
      commentImagePreview(cid,id){//点击评论图片事件，实现图片预览
        let pics = this.items.bestComment[cid].pictureCommentInfo.pictures
        this.preview(pics,'url',id)
        // var picList=e.target.parentNode.parentNode.querySelectorAll('.pic>img')
        // var pics=[]
        // for(var pic of picList){
        //   pics.push(pic.src)
        // }

        // var id=e.target.dataset.id
        // this.ImagePreview({
        //   images:pics,
        //   startPosition: parseInt(id),
        // });
      },
      rebroadcast(){//点击重播按钮
        var playBtn=this.$refs.play
        var playBtnImg=playBtn.querySelector('img')
        var video=this.$refs.video
        var vodBg=this.$refs.vodBg
        var v_j_show=this.$refs.v_j_show
        this.reset(this.share_show)
          video.play()
          vodBg.style.display="none";
          playBtnImg.src='img/index/pause.png'
          v_j_show.style.opacity=1
          video.ontimeupdate=()=>{
            this.v_j_val.val=(video.currentTime*100)/video.duration;
            this.v_j_val.settime=this.setTimer(video.currentTime);
            this.v_j_val.endtime=this.setTimer(video.duration);
          }
          this.share_show=false
          setTimeout(()=>{
            playBtn.style.opacity=0
            this.$refs.v_j_show.style.opacity=0
          },2000)
      },
      setWidth(num,width,height,p){//图片尺寸，实现根据图片数量变化，判断一行显示1张、2张、3张功能
        let rwidth='';
        var len=num.length
        if(len==1){
          rwidth='99%'
          this.imgwidth[p]='100%'
          if(width>height){
            this.picsHeight=innerWidth*height/width*0.98 +'px'
          }else{
            this.picsHeight=innerWidth*0.98+'px'
          }
        }else if(len%2==0&&len<5){
          if(width>height){
            this.imgheight[p]="100%"
          }else{
            this.imgwidth[p]='100%'
          }
          rwidth='48%';
          this.picsHeight=innerWidth*0.48+'px'
        }else if(len%2==1||len>=5){
          if(width>height){
            this.imgheight[p]="100%"
          }else{
            this.imgwidth[p]='100%'
          }
          rwidth='31%';
          this.picsHeight=innerWidth*0.31+'px'
        }
        return rwidth;
      },
      //返回被点击
      toComment(e){
        var lid=this.$refs.videos.dataset.lid;
        
        var classList=e.target.classList.toString()
        if(e.target.nodeName=='IMG'){
          return;
        }
        if(classList=='text'||classList=='head'||classList=='body'||classList=='comment-desc desc'||classList=='author'||classList=='name'||classList=='ispic'||classList=='foot'||classList=="desc desc-comment"){
          this.reset()
          this.comment({
            playTime:this.$refs.video?this.$refs.video.currentTime:0,
            items:this.items
          })
        }
      },
      //点赞
      likeCount(){
        this.axios.get("/praise",{params:{
          data:this.items
        }})
        .then(res=>{
          if(res.data.code==1){
            this.$refs.like.src="img/video/like_a.png"
            return;
          }
          this.$toast=res.data.msg
        })
        
      }
    },
  }
</script>
<style scoped> 

  .videos .foot .btn .desc{
    margin-left: 5px;
  }
  .videos .foot .btn .icon{
    width: 17px;height: 17px;
  }
  .videos .foot .btn{
    display: flex;
    align-items: center;
    font-size: 12px;
  }
  .videos .foot{
    display: flex;
    justify-content: space-around;
    margin: 12px 0;
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
  .comment .comment-info .praise{
    display: flex;
    width: 50px;
    justify-content: flex-end;
    font-size: 12px;
    position: absolute;
    top: 5px;
    right: 0;
  }
  .comment .comment-info .comment-desc{
    font-size: 14px;
    padding-right: 50px;
  }
  .comment .comment-info{
    position: relative;
  }
  .comment .author .godCommentDetail{
    position: absolute;
    top: -20px;right: -25px;
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
    /* padding-left: 20px; */
    align-items: center;
  }
  .comment{
    background-color: #eee;
    width: 80%;
    margin: 10px auto;
    padding: 10px 20px;
    border-radius: 5px;
  }

  .pic .pic-list{
    display: inline-block;
    margin: 2.5px;
    background-color: #ccc;
    overflow-y: scroll;
  }
  .pic{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 5px;
    
  }
  .share .share-btn button{
    background-color: transparent;
  }
  .share .share-btn{
    display: flex;
    justify-content: center;
  }
  .share .icon div{
    width: 43px;
    text-align: center;
  }
  .share .icon{
    padding: 0 20%;
    display: flex;
    justify-content: space-around;
    color: #fff;
    font-size: 12px;
    margin-bottom: 20px;
  }
  .share img{
    width: 32px;height: 32px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 50%;
  }
  .share{
    width: 100%;
    position: absolute;
    z-index: 1;
  }
  .shares{
    position: relative;
    width: 100%;height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6)
  }
  .text{
    padding:10px 10px;
    font-size: 14px;
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
    width: 70%

  }
  .videos .body .videoInfo .vdo .play img{
    
    width: 20px;height: 20px;
  }
  .videos .body .videoInfo .vdo .play{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 40px;height: 40px;
    background-color: rgba(0, 0, 0, .6);
    top: 50%;margin-top: -20px;
    left: 50%;margin-left: -20px;
    padding: 5px;
    z-index: 1;
    border-radius: 50%;
    transition: 0.5s;
    
  }
  .videos .body .videoInfo .vdo video{
    position: absolute;
    top: 0; 
    width: 100%;height: 100%;
    z-index: 0;
  }
  .videos .body .videoInfo .vdo .bg{
    width: 100%;
    position: absolute;
    top: 0; 
    z-index: 1;
    background-color: #fff;
  }
  .videos .body .videoInfo{
    width: 100%;
    position: relative;
    margin-top: 10px;
  }
  .videos .body .share{margin-left: 10px;}
  .videos .body{text-align: left;}
  .videos .head img{
    width: 80%;height: 80%;
    border-radius: 50%;
  }
  .videos .head .user_name{
    margin-left: 10px;
  }
  .videos .head .pic{
    width: 40px;height: 40px;
    margin-left: 10px;
    display: flex;
    align-items: center;
  }
  .videos .head .title{
    font-size: 13px;
    font-weight: 700;
    color: #000;
  }
  .videos .head{
    width: 100%;height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #aaa;
    font-size: 12px;
    text-align: left;
    margin-top: 8px;
  }
  .videos .nav{
    padding: 1px;
  }
  .videos{
    background-color: #fff;
    padding-bottom: 1px;
  }
</style>