<template>
  <div class="me">
    <!-- 登录与未登录部分 -->
    <div class="login">
      <!-- 未登录 -->
      <div class="isno" v-show="!$store.getters.getIsLogin">
        <mt-button class="login-reg" @click="toLogin">登录/注册</mt-button>
      </div>
      <!-- 已登录 -->
      <div class="isyes" v-show="$store.getters.getIsLogin">
        <div class="left">
          <!-- 头像 -->
          <div class="avatar">
            <img :src="this.$store.getters.getUser.avatar">
          </div>
          <!-- 其他信息保存 -->
          <div class="user">
            <div class="ug">
              <div class="user-name">{{this.$store.getters.getUser.user_name}}</div>
              <div class="gender">
                <img :src="`img/me/${this.$store.getters.getUser.gender}.png`">
              </div>
            </div>
            <div class="uid">乐乐号:{{this.$store.getters.getUser.uid}}</div>
            <div class="login-time">{{this.$store.getters.getUser.login_time}}</div>
          </div>
        </div>
        <!-- <div class="btn" @click="touser">
            <span>&gt;</span>
        </div> -->
      </div>
    </div>
    <!-- 粉丝赞等部分 fans：粉丝 -->
    <div class="fans">
      <div class="item">
        <div>{{this.$store.getters.getUser.praiseCount||0}}</div>
        <div>获赞</div>
      </div>
      <div class="item">
        <div>{{this.$store.getters.getUser.fansCount||0}}</div>
        <div>粉丝</div>
      </div>
      <div class="item" @click="tolink('attuser')">
        <div>{{this.$store.getters.getUser.attentionCount||0}}</div>
        <div>关注</div>
      </div>
    </div>
    <!-- 个人发帖记录等 -->
    <div class="me-fans">
      <div class="item">
        <div class="icon">
          <img src="img/me/foren.png">
        </div>
        <div class="font">
          发帖
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <img src="img/me/comment.png">
        </div>
        <div class="font">
          评论
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <img src="img/me/commend.png">
        </div>
        <div class="font">
          点赞
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <img src="img/me/collect.png">
        </div>
        <div class="font">
          收藏
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <img src="img/me/bHistory.png">
        </div>
        <div class="font">
          浏览历史
        </div>
      </div>
    </div>
    <!-- 广告图 advertising:广告 -->
    <div class="advertising">
      <img src="img/me/advertising.jpg">
    </div>
    <!-- 设置活动等 -->
    <div class="install">
      <!-- 每日抽奖 -->
      <div class="item">
        <div class="icon">
          <img src="img/me/gift.png">
        </div>
        每日抽奖
        <div class="right">
          开宝箱
          <div class="icon">
            <img src="img/me/box.png">
          </div>
          <div><van-icon name="arrow" /></div>
        </div>
      </div>
      <!-- 我的背包 -->
      <div class="item">
        <div class="icon">
          <img src="img/me/back.png">
        </div>
        我的背包
        <div class="right">
          <div><van-icon name="arrow" /></div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="van-hairline--bottom" style="padding: 1px;"></div>
      <!-- 官方认证 -->
      <div class="item">
        <div class="icon">
          <img src="img/me/v.png">
        </div>
        官方认证
        <div class="right">
          成为达人 获得权限
          <div class="icon">
            <img src="img/me/vip.png">
          </div>
          <div><van-icon name="arrow" /></div>
        </div>
      </div>
      <!-- 审核专区 -->
      <div class="item">
        <div class="icon">
          <img src="img/me/s.png">
        </div>
        审核专区
        <div class="right">
          <div><van-icon name="arrow" /></div>
        </div>
      </div>
      <!-- 荣誉殿堂 -->
      <div class="item">
        <div class="icon">
          <img src="img/me/p.png">
        </div>
        荣誉殿堂
        <div class="right">
          <div><van-icon name="arrow" /></div>
        </div>
      </div>
      <!-- 我的勋章 -->
      <!-- <div class="item">
        <div class="icon">
          <img src="img/me/x.png">
        </div>
        我的勋章
        <div class="right">
          <div class="icon">
            <img src="img/me/vip.png">
          </div>
          <div class="icon">
            <img src="img/me/vip.png">
          </div>
          <div class="icon">
            <img src="img/me/vip.png">
          </div>
        </div>
      </div> -->
      <!-- 分割线 -->
      <div class="van-hairline--bottom" style="padding: 1px;"></div>
      <!-- 帮助与反馈 -->
      <div class="item">
        <div class="icon">
          <img src="img/me/help.png">
        </div>
        帮助与反馈
        <div class="right">
          <div><van-icon name="arrow" /></div>
        </div>
      </div>
      <!-- 小黑屋 -->
      <!-- <div class="item">
        <div class="icon">
          <img src="img/me/p.png">
        </div>
        小黑屋
        <div class="right">
          <div><van-icon name="arrow" /></div>
        </div>
      </div> -->
      <!-- 分割线 -->
      <!-- <div class="van-hairline--bottom" style="padding: 1px;"></div> -->
      <!-- 青少年模式 -->
      <!-- <div class="item">
        <div class="icon">
          <img src="img/me/gift.png">
        </div>
        青少年模式
        <div class="right">
          未开启
          <div style="margin-left:10px;"><van-icon name="arrow" /></div>
        </div>
      </div> -->
      <!-- 设置 -->
      <div class="item">
        <div class="icon">
          <img src="img/me/set.png">
        </div>
        设置
        <div class="right">
          <div><van-icon name="arrow" /></div>
        </div>
      </div>
      <!-- 关于我们 -->
      <div class="item">
        <div class="icon">
          <img src="img/me/irt.png">
        </div>
        关于我们
        <div class="right">
          <div><van-icon name="arrow" /></div>
        </div>
      </div>
    </div>
    <div class="out-login-item" v-show="$store.getters.getIsLogin">
      <van-button color="#fff" class="out-login" @click="outLogin">退出登录</van-button>
    </div>
    <div style="height:55px;"></div>
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  },
  mounted() {
    let isLogin = ()=>{
      //取登录状态
      if(this.$store.getters.getIsLogin==true){
        this.axios.get("/getuser")
        .then(result=>{
          if(result.data.code==1){
            this.$store.commit("setUser",result.data.data);
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
    }
    isLogin()
  },
  methods: {
    //跳转路由
    tolink(rt){
      if(!this.$store.getters.getIsLogin){
        this.$toast('请先登录')
        this.$router.push('login')
        return;
      }
      if(rt=='attuser'){
        this.$router.push('/attuserlist')
        return;
      }
    },
    //去登陆
    toLogin(){
      this.$router.push("/login")
    },
    touser(){
      
    },
    //退出登录
    outLogin(){
      let outloginok =(action,done)=>{
        if (action === 'confirm') {
          let timer = setTimeout(()=>{
            this.axios.get('outlogin')
            .then(res=>{
              if(res.data.code=1){
                this.$store.commit("outlogin")
                this.$store.commit('setUser',{})
                done()
                clearTimeout(timer)
              }
            })
          }, 800);
        } else {
          done();
        }
      }


      this.$dialog.confirm({
        title:'退出',
        message:'确认退出登录',
        beforeClose:outloginok
      })
      .then(()=>{})
      .catch(()=>{})
      
      
    },
  },

}
</script>
<style scoped>
  .out-login-item{
    padding: 0 10px 10px;
  }
  .out-login{
    width: 100%;
    border-radius: 15px;
  }
  .out-login>.van-button__text{
    color: #000;
  }
  .install .right div{
    line-height: 22px;
  }
  .install .right{
    display: flex;
    position: absolute;
    right: 10px;
    color: #aaa;
    font-size: 10px;
    line-height: 18px;
  }
  .install .icon{width: 18px;height: 18px;margin: 0 8px;}
  .install .item{
    display: flex;
    padding: 4px 5px;
    position: relative;
    margin: 10px 0;
    
  }
  .install{
    margin: 10px;
    border-radius: 15px;
    background-color: #fff;
    padding: 15px;
    font-size: 14px;
  }
  .advertising img{border-radius: 15px;}
  .advertising{
    margin: 10px;
    border-radius: 15px;
  }
  .me-fans .icon{
    width: 30px;height: 30px;
    margin: 0 auto;
    margin-bottom: 6px;
  }
  .me-fans{
    display: flex;
    justify-content: space-around;
    margin: 20px 10px;
    background-color: #fff;
    padding: 15px;
    font-size: 12px;
    border-radius: 15px;
    -moz-box-shadow:0px 0px 4px #BABABA; -webkit-box-shadow:0px 0px 4px #BABABA; box-shadow:0px 0px 4px #BABABA;
  }
  .fans{
    display: flex;
    justify-content: space-around;
  }
  .login .isyes .btn{
    width: 100%;height: 80px;
    position: absolute;
    top: 0;left: 0;
  }
  .login .isyes .btn span{
    height: 100%;
    position: absolute;
    margin-right: 15px;
    line-height: 80px;
    right: 0;
    color: #000;
  }
  .login .isyes .login-time{
    font-size: 6px;
    font-weight: 500;
    text-align: left;
    color: #aaa;
  }
  .login .isyes .uid{
    font-size: 6px;
    text-align: left;
    margin: 5px 0;
    color: #000;
  }
  .login .isyes .gender{margin-left: 15px;}
  .login .isyes .user-name{
    font-size: 22px;
    font-weight: 500;
    text-align: left;
    color: #000;
  }
  .login .isyes .ug{
    display: flex;
    align-items: center;
  }
  /* 头像 */
  .login .isyes .avatar{
    width: 48px;height: 48px;
    border-radius: 50%;
    border: 1px solid #aaa;
    background-color: #ddd;
  }
  .login .isyes .avatar img{
    width: 100%;height: 100%;
    border-radius: 50%;
  }
  .login .isyes .user{
    margin-left: 20px;
  }
  .login .isyes .left{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .login .isyes{
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .login-reg{
    margin-top: 20px;
    background-color: #FE698D;
    border-radius: 20px;
    color: #fff;
    font-size: 12px;
    width: 40%;height: 24px;
  }
  .login .isno{width: 100%;}
  .login{
    width: 100%;height: 80px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .me{
    background-color: #eee;
    padding: 1px;
  }
</style>