<template>
  <div>
    <div class="index" :class="{active:!indexShow}">
      
      <!-- 顶部导航 -->
      <div class="header">
        <mt-navbar v-model="selected" class="bole-navbar">
          <mt-tab-item id="attention">关注</mt-tab-item>
          <mt-tab-item id="recommend">推荐</mt-tab-item>
          <mt-tab-item id="videos">视频</mt-tab-item>
          <mt-tab-item id="pics">趣图</mt-tab-item>
          <mt-tab-item id="texts">段子</mt-tab-item>
        </mt-navbar>
      </div>
      <!-- 下拉刷新 -->
      <div style="width:100%;height:50px;"></div>
      <van-pull-refresh v-model="isLoading" loosing-text="松手刷新" @refresh="onRefresh">
        <!-- 分类面板 -->
        <div class="constainer">
          <!-- 上滑加载更多 -->
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="这是底线"
            @load="onLoad"
            :immediate-check="false"
          >
            <mt-tab-container v-model="selected" class="container">
              <mt-tab-container-item id="attention">
                <att></att>
              </mt-tab-container-item>
              <mt-tab-container-item id="recommend">
                <videos class="video" v-for="(items,i) of recommend" :key="key(i)" :items="items" :comment="comment" type='recommend'></videos>
              </mt-tab-container-item>
              <mt-tab-container-item id="videos">
                <videos class="video" v-for="(items,i) of videoList" :key="i" :items="items" :comment="comment" type='videoList'></videos>
              </mt-tab-container-item>
              <mt-tab-container-item id="pics">
                <videos class="video" v-for="(items,i) of pictureList" :key="i" :comment="comment" :items="items"></videos>
              </mt-tab-container-item>
              <mt-tab-container-item id="texts">
                <videos class="video" v-for="(items,i) of articleList" :key="i" :comment="comment" :items="items"></videos>
              </mt-tab-container-item>
            </mt-tab-container>
          </van-list>
          <div style="height:55px;"></div>
        </div>
      </van-pull-refresh>
    </div>
    <!-- 详细内容列表 -->
    <div class="v-comment" :style="{left:comleft}">
      <comment :commentData="commentData" :decomment="decomment"></comment>
    </div>
  </div>
</template>
<script>
  import videos from './index/video'
  import comment from './index/comment'
  import att from './index/att'
  export default {
    //注册组件
    components:{
      'videos':videos,
      'comment':comment,
      'att':att
    },
    //组件变量
    data(){
      return{
        selected:'recommend',//正在显示的面板
        APItype:"recommend",
        //个个数据加载的页
        page:{
          attention:0,
          recommend:0,
          videos:0,
          pics:0,
          texts:0
        },
        recommend:[],//推荐数据数组
        videoList:[],//视频数据数组
        pictureList:[],//图片数据数组
        articleList:[],//文本数据数组
        //下拉刷新数据
        isLoading: true,
        loading:false,
        finished: false,
        commentData:{},//详情页数据
        indexShow:true,//首页显示与隐藏
        scrollY:0,//离开时位置
        comleft:"130%",
      }
    },
    //监听变量
    watch: {
      selected(){
         
        //      
        this.$store.commit("setTableType",this.selected)
        if(this.selected=='attention'){//关注
          this.finished=true
          this.APItype="attention"
          this.reset()
          return;
        }else{
          this.finished=false
        }
        if(this.selected=='recommend'){//推荐
          this.APItype="recommend"
          this.page.recommend=0;
          this.getData(this.APItype,this.page.recommend,data=>{
            this.recommend=data
            setTimeout(()=>{this.videoLoad()},1)
          })
          
          return;
        }
        if(this.selected=='videos'){//视频
          this.APItype='videoList'
          this.page.videos=0;
          this.getData(this.APItype,this.page.videos,data=>{
            this.videoList=data
            setTimeout(()=>{this.videoLoad()},1)
          })
          return;
        }
        if(this.selected=='pics'){//图片
          this.APItype='pictureList'
          this.page.pics=0;
          this.getData(this.APItype,this.page.pics,data=>{
            this.pictureList=data;
            
          })
          return;
        }
        if(this.selected=='texts'){//段子
          this.APItype='articleList'
          this.page.texts=0;
          this.getData(this.APItype,this.page.texts,data=>{
            this.articleList=data;
          })
          return;
        }
      },
    },
    //生命周期-挂载完成
    mounted() {
      this.selected=this.$store.getters.getTableType
      this.getData(this.APItype,this.page[this.selected],data=>{
        this[this.APItype]=data
        this.$store.commit("setData",{
          [this.APItype]:this[this.APItype]
        })
      })
    },
    //声明方法
    methods: {
      comment(obj){
        
        this.commentData=obj
        this.scrollY=scrollY
        this.indexShow=false;
        this.comleft=0
      },
      decomment(indexShow){
        this.comleft='130%'
        this.indexShow=true;
        setTimeout(() => {
          scrollTo(0,this.scrollY)
        }, 50);
        
      },
      getData(type,page,fn){//定义获取数据函数
        //提交数据
        this.$indicator.open('加载中...');
        this.axios.jsonp(this.jsonpPostUrl,this.getPostData(`http://api.cray.inf.miui.com/content/${type}`,{after:0,pageNum:page})
        )
        .then(res=>{
          fn(res.code==200?res.data.items:null);
          this.$indicator.close();
          this.reset()
          this.loading=false; 
          this.isLoading = false;
        })
      },
      onRefresh() {//下拉刷新事件，更新数据
        setTimeout(() => {
          this.page[this.selected]=0;
          this.getData(this.APItype,this.page[this.selected],data=>{
            this[this.APItype]=data
          })
        }, 500);
      },
      // 上滑加载更多
      onLoad(){
        // 异步更新数据
          setTimeout(() => {
            if(this.APItype){
              this.page[this.selected]++;
              this.getData(this.APItype,this.page[this.selected],data=>{
                this[this.APItype]=this[this.APItype].concat(data)
                this.$store.commit("setData",{
                  [this.APItype]:this[this.APItype]
                })
              })
            }else{
              console.log(123)
              this.loading=false; 
            }
            
          }, 500);
      },
      key(i){
        if(this.recommend.length==i+1){
          let timer = setTimeout(()=>{
            this.videoLoad()
            clearTimeout(timer)
          },1000)
          
        }
        return i;
      }
    }
  }
</script>
<style scoped>
  .v-comment{
    position: fixed;
    width: 100%;height: 100%;
    top:0;
    /* left: 130%; */
    background-color: #fff;
    z-index: 1000;
    transition: 0.5s;
    transition:all 0.5s ease;
    overflow: scroll;
  }

  .constainer .videos.video+.video{
    margin-top: 5px;
  }

  .is-selected{
    color: #FE698D !important;
    font-size: 18px !important;
    font-weight: 700;
    border-bottom: 3px solid #FE698D !important;
  }
  .container{
    /* padding-top: 50px; */
    background-color: #ddd;
  }
  .header{
    width: 100%;
    position: fixed;
    z-index: 5;
    background-color: #fff;
    border-bottom: 1px solid #aaa;
  }
  .bole-navbar{
    width: 70%;
  }
  .index{
    position: relative;
    left: 0;top: 0;
  }
  .index.active{
    height: 0;
    
  }
</style>