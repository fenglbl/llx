<template>
  <div class="attuserlist">
    <!-- 标题栏 头 -->
    <van-nav-bar title="关注" fixed border @click-left="back" class="aul-title" left-arrow>
    </van-nav-bar>
    <!-- 列表 -->
    <div class="aul-list">
      <!-- 加载中图片 -->
      <div class="fl-loading" v-show="!hotVipUser.length">
        <img src="img/loading.gif">
      </div>
      <div class="att-item-no" v-for="(itemV,iV) of hotVipUser" :key="'V'+iV">
          <div class="att-item-r-no">
            <van-image round class="att-item-r-img-no" height="30px" width="30px" fit="fill" :src="itemV.headUrl"/>
            <div class="att-item-r-desc-no">
              <div class="title">{{itemV.nickname}}<img class="aul-sex" :src="'img/me/'+(itemV.sex=='0'?'0':'1')+'.png'"></div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      hotVipUser:[]
    }
  },
  mounted(){
    this.axios.get('/getattuser')
    .then(res=>{
      if(res.data.code==1){
        this.hotVipUser=res.data.data
      }
    })
  },
  methods:{
    back(){
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
  .aul-sex{
    width: 12px;
    margin-left: 8px;
  }
  .aul-title i{
    color: #000;
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
  .aul-list{
    padding-top: 45px;
  }
  .att-item-r-desc-no .subtitle{
    font-size: 12px;
    color: #bbb;
    margin-top: 8px;
  }
  .att-item-r-desc-no .title{
    font-size: 12px;
    font-weight: 700;
    align-items: center;
    display: flex;
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
    align-items: center;
  }
  .att-item-no+.att-item-no{
    margin-top: 20px;
  }
  .att-item-no{
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .attuserlist{
    text-align: left;
    margin: 0 10px;
  }
</style>