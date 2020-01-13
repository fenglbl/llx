<template>
  <div class="login">
    <!-- 头 -->
    <mt-header title="登录" fixed class="header">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button icon="" slot="right" @click="reg">注册</mt-button>
    </mt-header>
    <!-- 登录 -->
    <div class="input">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="uname"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="upwd"></mt-field>
      <div v-show="upwdShow" class="upwd">忘记密码?</div>
      <mt-button class="btn" @click="login">登 录</mt-button>
    </div>
    <!-- 快捷登录 -->
    <div class="other-login">
      <span class="text">其他登录方式</span>
      <div class="btns">
        <div class="icon" @click="login_WX">
          <div class="pic">
            <img src="img/login/WX.png">
          </div>
          <span>
            微信
          </span>
        </div>
        <div class="icon" @click="login_QQ">
          <div class="pic">
            <img src="img/login/QQ.png">
          </div>
          <span>
            QQ
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      uname:'',
      upwd:'',
      upwdShow:true,
    }
  },
  methods: {
    login(){
      if(!this.uname){//账号为空
        this.$toast("请输入用户名");
        return;
      }
      if(!this.upwd){//密码为空
        this.$toast("请输入密码");
        return;
      }
      let data = this.qs.stringify({uname:this.uname,upwd:this.upwd})
      this.axios.post("/login",data)
      .then(res=>{
        if(res.data.code==1){
          this.$toast("登录成功");
          this.$store.commit("login")
          this.$router.push("/")
        }else{
           this.$toast(res.data.msg)
        }
      })
    },
    login_WX(){//微信登录

    },
    login_QQ(){//QQ登录

    },
    reg(){
      this.$router.push('/reg')
    }
  },
  watch: {
    upwd(){
      this.upwdShow=this.upwd?false:true
    }
  },
}
</script>
<style scoped>
  .other-login .icon span{
    line-height: 30px;
    color: #BBBBBB;
  }
  .other-login .icon .pic{
    background-color: #DDDDDD;
    width: 28px;height: 28px;
    border-radius: 50%;
    padding: 8px;
  }
  .other-login img{
    width: 100%;
  }
  .other-login .icon{
    height: 74px;
    font-size: 12px;
  }
  .other-login .btns{
    width: 60%;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  .other-login .text{
    position: absolute;
    padding: 0 10px;
    font-size: 12px;
    background-color: #fff;
    top: -8px;
  }
  .other-login{
    width: 60%;height: 40px;
    position: absolute;
    bottom: 120px;
    border-top:0.5px solid #ddd;
    display: flex;
    justify-content: space-around;
  }
  .login .upwd{
    font-size: 12px;
    color: #FE698D;
    position: absolute;
    right: 10px;
    top:114px;
  }
  .login .btn{
    width: 80%;
    background-color: #FE698D;
    color: #fff;
    border-radius: 30px;
    font-size: 16px;
  }
  .login .input .mint-cell{
    margin: 25px 0;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    /* border-bottom: 0.5px solid #ddd; */
    
  }
  .login .input{
    position: fixed;
    top: 15%;
    width: 90%;
    height: 240px;
    border-radius: 40px;
    -moz-box-shadow:0px 0px 15px #BABABA; -webkit-box-shadow:0px 0px 15px #BABABA; box-shadow:0px 0px 15px #BABABA;
  }
  .login .header{
    background-color: #FE698D;
  }
  .login{
    display: flex;
    justify-content: space-around;
  }
</style>