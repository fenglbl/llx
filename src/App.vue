<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="position-div"/>
    </transition>
  </div>
</template>
<script>
export default {
  data(){
    return{
      transitionName:'slide-left'
    }
  },
  watch:{
    $route(to,from){
      // console.log(to,from)
      if(to.meta > from.meta){
        this.transitionName = "slide-left"
      }else{
        this.transitionName = "slide-right"
      }
    }
  }
}
</script>
<style>
body{
  margin: 0;padding: 0;
}
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif,'Avenir';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.position-div{
   position:absolute;
   left:0;
   right:0;
   top:0;
   bottom:0;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 300ms;
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
