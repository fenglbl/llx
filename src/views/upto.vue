<template>
  <div class="up">
    <!-- 页头 -->
    <van-nav-bar @click-left="back">
      <van-icon class="up-title" name="cross" slot="left" />
      <van-button
        round
        color="#F95F84"
        slot="right"
        type="primary"
        size="mini"
        :disabled="!(message || type == 't' || fileList.length)"
        :loading="!currentRate == 0"
        @click="upto"
        >发布</van-button
      >
    </van-nav-bar>
    <!-- 上传进度 -->
    <van-progress
      color="#F95F84"
      :show-pivot="false"
      stroke-width="2px"
      :percentage="currentRate"
    />
    <!-- 内容输入框 -->
    <van-field
      v-model="message"
      rows="3"
      :autosize="{ maxHeight: 120 }"
      type="textarea"
      placeholder="新鲜内容更容易上热门哦"
      ref="msg"
    />
    <!-- 话题选择 -->
    <div class="up-topic" @click="totopiclist">
      <div class="up-topic-btn">
        <div class="left">#</div>
        <div class="right">{{ topic.topicName }}</div>
      </div>
    </div>
    <!-- 图片选择框 -->

    <div v-show="type !== 't'" class="up-list">
      <!-- <van-uploader v-model="fileList">
        <van-button icon="photo" type="primary">上传图片</van-button>
      </van-uploader> -->
      <van-uploader
        v-model="fileList"
        multiple
        :max-count="type == 'v' ? 1 : 9"
        :accept="(type == 'p' ? 'image' : 'video') + '/*'"
        preview-size="100px"
      >
      </van-uploader>
    </div>

    <!-- 话题选择页 -->
    <div class="up-topic-list" :style="{ left: topiclistleft + '%' }">
      <!-- 标题栏 -->
      <van-nav-bar
        @click-left="topicback"
        title="选择话题"
        :fixed="!topiclistleftout"
      >
        <van-icon class="up-title" name="cross" slot="left" />
      </van-nav-bar>
      <!-- 不发布话题 -->
      <div class="notopic" @click="totopic({ topicName: '添加话题' })">
        <van-icon name="close" />
        <span class="desc">不发布任何话题</span>
      </div>
      <!-- 话题列表 -->
      <div
        class="topic-list"
        :style="{ 'padding-top': !topiclistleftout ? '86px' : '40px' }"
      >
        <!-- 标题 -->
        <span class="title">热门话题</span>
        <!-- 加载中图片 -->
        <div class="fl-loading" v-show="!topiclist.length">
          <img src="img/loading.gif" />
        </div>
        <!-- 列表 -->
        <div
          class="list"
          @click="totopic(item)"
          v-for="(item, i) of topiclist"
          :key="i"
        >
          <div class="left">
            <img :src="item.icon" />
            <span>{{ item.topicName }}</span>
          </div>
          <van-button
            round
            color="#F95F84"
            slot="right"
            type="primary"
            size="mini"
            >选择</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: "", //输入内容
      topic: { topicName: "添加话题" }, //话题名
      fileList: [], //文件列表
      type: "", //发布类型
      topiclistleft: 100, //话题列表页
      topiclistleftout: 100, //话题延时
      topiclist: [], //话题列表
      currentRate: 0 //上传进度
    };
  },
  watch: {
    topiclistleft() {
      if (this.topiclistleft == 100) return;
      new Promise((rs, qj) => {
        if (!sessionStorage.getItem("up-topic-list")) {
          let url =
            "http://api.cray.inf.miui.com/topic/hotTopic?data=%7B%22header%22%3A%7B%22token%22%3A%22GFwj2iLTDe979hdDKJGWiS18BskEXXsjBeHKXITcJQl7HGZWYwhsPcEwJZAcS0VBdNkBJ5AWMiEBeOUpczf5mvpUnYolWkxHGPceY44CoPOrySbJJP9AViOV36tRKltV%22%2C%22deviceId%22%3A%22W2aIHkEOGTgDAFS3Np5jXl%2Bc%22%2C%22imeiMd5%22%3A%22%22%2C%22apkVersion%22%3A%222.1.6%22%2C%22apkChannel%22%3A%22xiaomi%22%7D%2C%22data%22%3A%7B%22after%22%3A%220%22%7D%7D";
          this.axios.jsonp(this.jsonGetUrl, "url=" + url).then(res => {
            if (res.code == 200) {
              sessionStorage.setItem("up-topic-list", JSON.stringify(res.data));
              rs(null);
            }
          });
        } else {
          rs(null);
        }
      }).then(() => {
        this.topiclist = JSON.parse(
          sessionStorage.getItem("up-topic-list")
        ).items;
      });
    }
  },
  mounted() {
    this.type = this.$route.params.type;
    this.$refs.msg.focus();
  },
  methods: {
    //路由返回
    back() {
      if (this.message || this.fileList.length) {
        this.$dialog
          .confirm({
            message: "退出将会丢失已编辑的内容",
            confirmButtonText: "退出",
            confirmButtonColor: "red",
            cancelButtonColor: "#1989fa"
          })
          //确定退出
          .then(() => {
            this.$router.go(-1);
          })
          //取消
          .catch(() => {});
        return;
      }
      this.$router.go(-1);
    },
    //话题选择返回
    topicback() {
      this.topiclistleft = 100;
      this.topiclistleftout = 100;
    },
    //话题选择
    totopiclist() {
      this.topiclistleft = 0;
      let timer = setTimeout(() => {
        this.topiclistleftout = 0;
        clearTimeout(timer);
      }, 500);
    },
    //选择主题
    totopic(item) {
      this.topic = item;
      this.topiclistleft = 100;
      this.topiclistleftout = 100;
    },
    //点击发布事件
    upto() {
      const toast = this.$Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: this.currentRate + "%"
      });
      this.currentRate = 0;
      let plan = e => {
        this.currentRate = e;
        toast.message = this.currentRate + "%";
      };
      const param = new FormData();
      param.append("type", this.type);
      for (var i = 0; i < this.fileList.length; i++) {
        param.append("file" + i, this.fileList[i].file);
      }
      param.append("msg", this.message);
      param.append("topic", JSON.stringify(this.topic));

      console.log(param.get("file"));
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress(e) {
          plan(parseInt((e.loaded / e.total) * 100));
        }
      };
      this.axios.post("/upload", param, config).then(res => {
        if (res.data.code == 1) {
          this.$toast("发布成功");
          this.$router.go(-1);
        } else if ((res.data.code = -100)) {
          this.$toast("请先登录");
          this.$router.push("login");
        }
        this.$Toast.clear();
        this.currentRate = 0;
      });
    }
  }
};
</script>
<style scoped>
.fl-loading > img {
  width: 25px;
  height: 25px;
}
.fl-loading {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  text-align: center;
}
.topic-list .list .left span {
  margin-left: 8px;
}
.topic-list .list .left img {
  width: 35px;
  height: 35px;
  border-radius: 5px;
}
.topic-list .list .left {
  display: flex;
  align-items: center;
}
.topic-list .list {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topic-list .title {
  color: #999;
  margin-bottom: 10px;
}
.topic-list {
  padding: 10px;
  text-align: left;
}
.notopic .desc {
  margin-left: 10px;
}
.notopic {
  color: #f95f84;
  font-size: 15px;
  background-color: #fff;
  align-items: center;
  padding: 10px;
  position: fixed;
  z-index: 1;
  top: 46px;
  width: 100%;
  display: flex;
}
.up-topic-list {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: #fff;
  z-index: 10;
  transition: all 0.5s ease;
  overflow-y: scroll;
}
.up-list {
  text-align: left;
  padding: 10px;
}
.up-topic-btn .right {
  box-sizing: border-box;
  border: 1px solid #f95f84;
  height: 25px;
  font-size: 12px;
  color: #f95f84;
  padding: 3px 8px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.up-topic-btn .left {
  background-color: #f95f84;
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  color: #fff;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 18px;
}
.up-topic-btn {
  padding: 10px;
  display: flex;
  text-align: left;
}
.up-title {
  color: #000 !important;
  font-size: 14px;
}
</style>
