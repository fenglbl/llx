import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from "axios"
import vant, { version } from 'vant'
import 'vant/lib/index.css'
import qs from 'qs'
//引入qs模块
Vue.prototype.qs=qs
//axios跨域
axios.jsonp=function(url,data){
  //所有axios的函数都是支持promise的，所以
  return new Promise(
    function(resolve,reject){
      //Promise中的代码和不用promise时是完全一样的
      var script=null;
      var ms=new Date().getTime();
      var r=parseInt(Math.random()*9000+1000);
      var fname=`doit${ms}${r}`;
      window[fname]=function(res){
        //要对res做什么处理，应该下一个.then说了算！
        //这里只负责开门，并传出服务端返回结果
        resolve(res);
        //删除本次临时使用的script和函数
        document.head.removeChild(script);
        delete window[fname];
      }
      script=document.createElement("script");
      script.src=`${url}?${data}&&callback=${fname}`;
      document.head.appendChild(script);
    }
  )
};
//判断是在服务器，还是开发端
if(location.origin=='http://llx.bolefx.xyz'){
  axios.defaults.baseURL="http://www.bolefx.xyz:8081/";
}else{
  axios.defaults.baseURL="http://127.0.0.1:8081/";
}

axios.defaults.withCredentials=true


Date.prototype.format = function(fmt){//给date时间对象添加格式化时间方法
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };

  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
        
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(
        RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
    }       
  }

  return fmt;
}

function setTimer(timer){//剩余时间格式化 3600=01:00:00
  timer=parseInt(timer)
  var h=0;
  var m=0;
  var s=0;
  if(timer>=60){
    m=parseInt(timer/60)
    s=timer%60;
    if(m>=60){
      h=parseInt(m/60);
      m=m%60;
    }
  }else{
    s=timer
  }
  h=h<10?'0'+h:h;
  m=m<10?'0'+m:m;
  s=s<10?'0'+s:s;
  return (h<1?'':h+":")+m+":"+s
}
Vue.prototype.setTimer=setTimer
function reset(){//播放重置函数
    var items=document.querySelectorAll(".videoInfo")
    for (const item of items) {
      var video = item.querySelector(".v")
      if(video){
        video.pause()
        var v_j_val = item.querySelector(".v-j")
        v_j_val.style.opacity=0
        var share_show=item.querySelector('.shares')
        var play=null;
        if(share_show.style.display){
          play = item.querySelector(".play")
          play.style.opacity=1
        }
        var playBtnImg = item.querySelector(".play img")
        playBtnImg.src='img/index/play.png'
      }
    }
}

(function(){
    //视频懒加载
    var videoList = [],delay,time = 200,offset = 0;
    function _delay(){//函数节流
      clearTimeout(delay);
      delay = setTimeout(() => {
        _loadVideo();
      },time)
    };

    var _loadVideo=()=>{//执行视频滚动加载
      for(var i = 0,len = videoList.length; i < len; i++){
        if(_isShow(videoList[i])){
          
          if(!videoList[i].dataset.play){
            if(vuef.$store.getters.getTable=='home'&&vuef.$store.getters.getTableType!='attention'){
              videoList[i].dataset.play=true
              var vod=videoList[i].parentNode
              vod.querySelector('.play img').src='img/video/loading.gif'
              videoList[i].load()
            }
          }
          return;
        }
      }
    };
    function _isShow (el, offset = 0) {//检测视频在不在可视窗口内
      const box = el.getBoundingClientRect(),
      top = (box.top >= 0),
      left = (box.left >= 0),
      bottom = (box.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset),
      right = (box.right <= (window.innerWidth || document.documentElement.clientWidth) + offset);
      return (top && left && bottom && right);
    }
    function videoLoad(){//获取所有需要实现懒加载图片对象引用并设置window监听事件scroll
        videoList=[]
        var selector =this.APItype?'.videoLazyLoad.'+this.APItype:'.videoLazyLoad';
        videoList = document.querySelectorAll(selector);
        window.addEventListener('scroll',_delay)
    };
    Vue.prototype.videoLoad=videoLoad;//把函数放到Vue内
})()
     
Vue.prototype.getPostData=function(url,data){
  return `url=${url}&data=data={"header":{"token":"","deviceId":"W2aIHkEOGTgDAFS3Np5jXl+c","imeiMd5":"","apkVersion":"2.1.5","apkChannel":"xiaomi"},"data":${JSON.stringify(data)}}`
}
Vue.prototype.jsonpPostUrl='http://ka.bolefx.xyz/jsonp/post'
Vue.prototype.jsonGetUrl='http://ka.bolefx.xyz/jsonp/get'

Vue.prototype.isLogin=null;
Vue.prototype.reset=reset;
Vue.prototype.axios=axios;
Vue.use(MintUI)


//引入图片预览vant组件
import { ImagePreview,Lazyload ,Toast } from 'vant';
Vue.prototype.ImagePreview=ImagePreview;
Vue.prototype.$Toast=Toast;
Vue.use(Lazyload, {
  loading:''
});

//定义全局图片预览函数
let preview=(pics,type,id)=>{
  pics = pics.map(val=>{
    return val[type]
  })
  ImagePreview({
    images:pics,
    startPosition: parseInt(id),
    loop:false,
    lazyLoad:true
  });
}
Vue.prototype.preview=preview

Vue.use(vant)


Vue.config.productionTip = false



var vuef=new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')

