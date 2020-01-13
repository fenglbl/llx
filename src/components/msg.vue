<template>
  <div class="msg">
    <!-- 头 -->
    <div class="msg-head">
      <van-dropdown-menu active-color="#FE698D">
        <van-dropdown-item v-model="msgHeadType" :options="msgOption" />
      </van-dropdown-menu>
    </div>
    <!-- 未登录 -->
    <div v-if="!this.$store.getters.getIsLogin">
      <nologin></nologin>
    </div>
    <!-- 已登录 -->
    <div v-else class="msg-content">
      没有消息
    </div>
  </div>
</template>
<script>
import nologin from './msg/nologin'
export default {
  components:{
    "nologin":nologin
  },
  data() {
    return {
      msgHeadType:'msgAll',
      msgOption:[
        { text: '全部消息', value: 'msgAll' },
        { text: '评论', value: 'comment' },
        { text: '点赞', value: 'like' },
        { text: '系统消息', value: 'system' }
      ]
    }
  },
  mounted() {
    
  },
  methods: {
    
  },

}
</script>
<style scoped>
  .msg-content{
    margin-top: 15px;
    color: #ccc;
  }
  .msg-head{
    height: 40px;
    border-bottom: 1px solid #ccc; 
  }
</style>