<template>
  <div>
    <div class="msg-login-no">
      <div class="msg-login-no-content">
        <div class="msg-login-no-img">
          <img src="img/login/nologin.png">
        </div>
        <div class="msg-login-no-title">登录才能查看你的内容</div>
        <div>
          <van-button class="msg-login-no-btn" type="primary" color="#FE698D" round size="small" @click="attDoLoin">登录</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    attDoLoin(){
      //登录
      this.$router.push("/login")
    }
  },
}
</script>
<style scoped>
  .msg-login-no-btn{
    width: 25%;
  }
  .msg-login-no-title{
    margin:15px 0;
    font-size: 14px;
    color: #ccc;
  }
  .msg-login-no-img>img{
    width: 128px;height: 128px;
  }
  .msg-login-no-content{
    position: absolute;
    top: 50%;
    margin-top: -150px;
    width: 100%;
  }
  .msg-login-no{
    position: fixed;
    height: 100%;
    width: 100%;
  }
</style>