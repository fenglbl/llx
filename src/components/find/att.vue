<template>
  <div class="find-att">

      <div class="att-item-no" @click="dofindlist(itemT.id)" v-for="(itemT,iT) of hotTopic" :key="'T'+iT" :data-id='itemT.id'>
        <div class="att-item-r-no">
          <van-image class="att-item-r-img-no noround" height="100%" fit="fill" :src="itemT.icon "/>
          <div class="att-item-r-desc-no">
            <div class="title">{{itemT.topicName}}</div>
            <div class="subtitle">{{itemT.topicDesc}}</div>
          </div>
        </div>
      </div>
      <!-- find内容列表 -->
      <div class="find-list" ref="att" :style="{left:findlistleft}">
        <findList :findheader="findheader" :titleShow='titleShow' :findlistleft="findlistleft" :doback="doback"></findList>
      </div>

  </div>
</template>
<script>
import findList from './findList'
  export default {
    components:{
      "findList":findList
    },
    props:{
      getatt:{type:Function}
    },
    data(){
      return {
        hotTopic:[],
        findlistleft:'100%',
        findheader:{},
        titleShow:false
      }
    },
    mounted() {
      //监听hot滚动
      this.$refs.att.addEventListener('scroll',this.attScroll)
      this.axios.get('getatt')
      .then(res=>{
        this.hotTopic = res.data.data
      })
      this.getatt(()=>{
        this.axios.get('getatt')
        .then(res=>{
          this.hotTopic = res.data.data
        })
      })
    },
    methods: {
      //find-hot滚动时间
      attScroll(e){
        if(this.$refs.att.scrollTop>190){
          this.titleShow=true
        }else{
          this.titleShow=false
        }
      },
      //返回
      doback(){
        this.findlistleft='100%';
      },
      dofindlist(id){
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
  .find-att{
    text-align: left;
  }
</style>