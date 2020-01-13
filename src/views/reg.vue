<template>
  <div class="reg">
    <!-- 导航头 -->
    <mt-header title="注册" fixed class="header">
      <router-link to="/login" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <!-- 注册表 -->
    <div class="form">
      <van-cell-group class="input" ref="form">
        <van-field
          v-model="uname.val"
          label="用户名"
          clearable
          placeholder="请输入用户名"
          :error-message="uname.err"
          required
          @blur="unameBlur"
          :data-titil="uname.msg"
        />
        <van-field
          v-model="upwd.val"
          type="password"
          label="密码"
          clearable
          placeholder="请输入密码"
          :error-message="upwd.err"
          required
          @blur="upwdBlur"
          :data-titil="upwd.msg"
        />
        <van-field
          v-model="cpwd.val"
          type="password"
          label="重复密码"
          clearable
          placeholder="请重复密码"
          :error-message="cpwd.err"
          required
          @blur="cpwdBlur"
          :data-titil="cpwd.msg"
        />
        <van-field
          v-model="phone.val"
          type="number"
          maxlength="11"
          label="手机号"
          clearable
          placeholder="请输入手机号"
          :error-message="phone.err"
          required
          @blur="phoneBlur"
          :data-titil="phone.msg"
        />
        <van-field
          v-model="email.val"
          maxlength
          label="邮箱"
          clearable
          placeholder="请输入邮箱"
          :error-message="email.err"
          required
          @blur="emailBlur"
          :data-titil="email.msg"
        />
        <van-field
          v-model="user_name.val"
          maxlength
          label="昵称"
          clearable
          placeholder="请输入昵称"
          :error-message="user_name.err"
          required
          @blur="user_nameBlur"
          :data-titil="user_name.msg"
        />
        <van-field
          v-model="sms.val"
          center
          clearable
          required
          label="短信验证码"
          placeholder="请输入短信验证码"
          :error-message="sms.err"
          :data-titil="sms.msg"
        >
          <van-button @click="tosms" :loading='sms.loading' loading-text="发送中..." slot="button" size="small" type="primary">{{sms.btnName}}</van-button>
        </van-field>
      </van-cell-group>
    </div>
    <van-button @click="reg" :loading='isbtnReg.loading' loading-text="注册中..." class="reg-btn" round color="#FE698D" plain size="large" type="info">{{isbtnReg.btnName}}</van-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      uname:{val:'',err:'',msg:'用户名'},
      upwd:{val:'',err:'',msg:'密码'},
      cpwd:{val:'',err:'',msg:'重复密码'},
      phone:{val:'',err:'',msg:'手机号'},
      email:{val:'',err:'',msg:'邮箱'},
      user_name:{val:'',err:'',msg:'昵称'},
      sms:{val:'',err:'',msg:'验证码',loading:false,btnName:'发送验证码'},
      gender:1,
      isbtnReg:{loading:false,btnName:"注册"}
    }
  },
  methods: {
    //获取登录数据
    getRegData(url,data,fn){

      this.axios.get(url,{params:data})
      .then(res=>{
        
        fn(res.data)
      })
    },
    //验证用户名
    unameBlur(){
      if(/^\w{3,16}$/.test(this.uname.val)){
        //验证重复
        this.getRegData("get_uname",{uname:this.uname.val},data=>{
          if(data.code==1){
            this.uname.err=""
          }else{
            this.uname.err="用户名重复"
          }
        })
      }else{
        this.uname.err="用户名格式错误"
      }
    },
    //验证密码
    upwdBlur(){
      if(/^\w{6,32}$/.test(this.upwd.val)){
        this.upwd.err=""
      }else{
        this.upwd.err="密码格式错误"
      }
    },
    //验证重复密码
    cpwdBlur(){
      if(this.cpwd.val==this.upwd.val&&this.cpwd.val!=''){
        this.cpwd.err=""
      }else{
        this.cpwd.err="两次密码不一致"
      }
    },
    //验证手机号
    phoneBlur(){
      if(/^1[3-9]\d{9}$/.test(this.phone.val)){
         //验证重复
        this.getRegData("get_phone",{phone:this.phone.val},data=>{
          if(data.code==1){
            this.phone.err=""
          }else{
            this.phone.err="手机号重复"
          }
        })
      }else{
        this.phone.err="手机号格式不正确"
      }
    },
    //验证邮箱
    emailBlur(){
      if(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email.val)){
        this.getRegData("get_email",{email:this.email.val},data=>{
          if(data.code==1){
            this.email.err=""
          }else{
            this.email.err="邮箱重复"
          }
        })
      }else{
        this.email.err="邮箱格式不正确"
      }
    },
    //验证昵称
    user_nameBlur(){
      if(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(this.user_name.val)){
        this.user_name.err=""
      }else{
        this.user_name.err="昵称不合法"
      }
    },
    //点击注册
    reg(){
      this.isbtnReg.loading=true;
      var data={uname:this.uname,upwd:this.upwd,cpwd:this.cpwd,phone:this.phone,email:this.email,user_name:this.user_name}
      var regData={};
      for(var key in data){
        if(data[key].val==''){//验证输入框有没有空数据
          this[key].err=`${data[key].msg}不能为空`
          var inp=this.$refs.form.querySelector(`[data-titil='${data[key].msg}']`)
          this.isOk(inp)
          this.isbtnReg.loading=false;
          return;
        }
        if(data[key].err!=''){//验证输入是否报错
          var inp=this.$refs.form.querySelector(`[data-titil='${data[key].msg}']`)
          this.isOk(inp)
          this.isbtnReg.loading=false;
          return;
        }
        regData[key]=data[key].val
      }
      regData.gender=this.gender
      regData = this.qs.stringify(regData)
      this.axios.post('reg',regData)
      .then(res=>{
        this.isbtnReg.loading=false;
        this.$toast(res.data.msg)
      })
    },
    //发送验证码
    tosms(){
      this.sms.loading=true
    },
    //验证报错
    isOk(inp){
      inp.focus()
      var inp=$(inp).css({
        border:"1px solid #f00",
        transition: '0.8s'
      })
      var timer = setTimeout(function(){
        $(inp).css({
          border:"1px solid transparent",
        })
        clearTimeout(timer)
      },1000)
    }
  },
}
</script>
<style scoped>
  .reg-btn{
    width: 76%;height: 40px;
    line-height: 40px;
    font-size: 12px;
    margin-top: 30px;
    
  }
  .form .input{
    margin-bottom: 30px;
    /* height: 408px; */
  }
  .form{
    position: relative;
    top: 50px;
    
  }
  .reg .header{
    background-color: #FE698D ; 
  }
</style>