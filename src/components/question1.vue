<template>
  <div style="background: rgb(216, 242, 242)">
    <div class="top">
      <van-swipe
        class="my-swipe"
        ref="swipe"
        :touchable="false"
        :duration="300"
        :show-indicators="false"
        indicator-color="white"
      >
        <van-swipe-item v-for="(item, index) in data" :key="index">
          <div class="topic flex" style="box-sizing: content-box">
            {{ item.question }}
          </div>
        </van-swipe-item>
      </van-swipe>
      <div class="progress">
        <p :style="{ width: (100 / data.length) * (dataIndex + 1) + '%' }"></p>
      </div>
    </div>
    <div class="main">
      <div
        class="option"
        v-for="(item, index) in this.data[dataIndex].options"
        :key="index"
      >
        <p
          @touchstart="setAnswer(index)"
          :class="{ current: answerData[dataIndex] == index }"
        >
          {{ item }}
        </p>
      </div>
    </div>
    <div class="page flex">
      <div class="arrow">
        <div class="flex" v-show="dataIndex != 0" @click="change(false)">
          <van-icon name="arrow-left" />
        </div>
      </div>
      <div>
        <span>{{ dataIndex + 1 }}</span
        ><em>·</em>{{ data.length }}
      </div>
      <div class="arrow">
        <div
          :class="[dataIndex < answer.length ? 'flex' : 'flex opacity']"
          v-show="dataIndex != data.length - 1"
          @click="change(true)"
        >
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div
      class="result flex"
      v-show="dataIndex == data.length - 1 && isResultBtn"
      @click="getResult"
    >
      查看结果
    </div>
  </div>
</template>
 
<script>
module.exports = {
  data: function () {
    return {
      data: [{ options: [] }],
      _url: "",
      dataIndex: 0,
      isResultBtn: false,
      answerData: {
        0: "-1",
      },
      answer: [],
      isClicktag: false,
      //   test_type: "mbti",
    };
  },
  props: {
    test_type: String,
    cl: Boolean
  },
  created() {
    this._url = this.ccsrvFn();
    this.get_questions();
  },

  methods: {
    change(type) {
      debugger
      if(!this.cl){
        return 
      }
      if (this.isClicktag) {
        return false;
      }
      this.isClicktag = true;
      if (type) {
        if (this.dataIndex < this.answer.length) {
          setTimeout(() => {
            this.dataIndex++;
            this.isClicktag = false;
          }, 300);
          this.$refs.swipe.next();
        } else {
          this.$toast({
            message: "请选择一个选项",
            position: "bottom",
          });
          this.isClicktag = false;
        }
      } else {
        if (this.dataIndex > 0) {
          setTimeout(() => {
            this.dataIndex--;
            this.isClicktag = false;
          }, 300);
          this.$refs.swipe.prev();
        } else {
          this.isClicktag = false;
        }
      }
    },
    setAnswer(index) {
      if(!this.cl){
        return 
      }
      if (this.isClicktag) {
        return false;
      }
      this.isClicktag = true;
      this.answerData[this.dataIndex] = index;
      if (this.dataIndex == this.data.length - 1) {
        this.isClicktag = false;
        this.isResultBtn = true;
        this.setAnswerArray();
        return false;
      }
      this.$refs.swipe.next();
      setTimeout(() => {
        this.dataIndex++;
        this.isClicktag = false;
      }, 300);
      this.setAnswerArray();
      console.log("结果：", this.answerData);
      console.log("结果数组：", this.answer);
    },
    setAnswerArray() {
      var answer = [];
      for (const key in this.answerData) {
        answer.push(this.answerData[key]);
      }
      this.answer = answer;
    },
    get_questions() {
      axios
        .get(
          domain() +
            "/psychology/common_test/get_questions?test_type=" +
            this.test_type
        )
        .then((res) => {
          if (res.data.code == 0) {
            this.data = res.data.data;
          } else {
          }
        });
    },
    getResult() {
      //   vant.Dialog.alert({
      //     title: "答案",
      //     message: this.answer,
      //   }).then(() => {
      //     // on close
      //   });
      this.$emit("getresult", this.answer);
    },
    ccsrvFn() {
      var domain = window.location.host;
      var str = "https://api-test.cece.com";
      if (domain == "m.cece.com") {
        str = "https://m.cece.com";
      }
      return str;
    },
    GetQueryValue(queryName) {
      var query = decodeURI(window.location.search.substring(1));
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) {
          return pair[1];
        }
      }
      return null;
    },
    startHandle: function () {
      location.href = "./enneagram-result.html";
    },
  },
};
</script>
 
<style scoped>
.flex {
  display: flex;
  display: -webkit-flex;
}

.top {
  height: 3.94666rem;
  background-color: #d8f2f2;
  width: 100%;
  overflow: hidden;
}

.topic {
  font-size: 0.48rem;
  line-height: 0.8rem;
  height: 1.6rem;
  padding: 0.66666rem 0.64rem;
  color: #2e2e2e;
  justify-content: flex-start;
  align-items: center;
}

.progress {
  width: 8.72rem;
  height: 0.2133333rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.613333rem;
  overflow: hidden;
  margin: 0 0.64rem;
}

.progress p {
  width: 10%;
  border-radius: 0.613333rem;
  background-color: #4b8685;
  height: 0.2133333rem;
  margin: 0;
  padding: 0;
}

.main {
  border-top-left-radius: 0.426666rem;
  border-top-right-radius: 0.426666rem;
  box-shadow: 0 -0.05333rem 0.05333rem 0 rgba(169, 169, 169, 0.4);
  background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  padding-top: 0.26666rem;
}

.option {
  width: 8.72rem;
  margin: 0 auto;
  margin-top: 0.266666rem;
}

.option p {
  /* margin-bottom: .64rem; */
  box-shadow: 0 0 0.106666rem 0 rgba(169, 169, 169, 0.4);
  border: solid 0.4px rgba(169, 169, 169, 0.4);
  background-color: #ffffff;
  border-radius: 0.32rem;
  padding: 0.32rem 0.64rem;
  font-size: 0.42666rem;
  color: #5f5f5f;
  /* line-height: 0.533333rem; */
  line-height: 0.693333rem;
}

/* .option p:hover{
			box-shadow: 0 0 0.106666rem 0 rgba(60, 205, 234, 0.8);
  			border: solid 0.4px rgba(60, 205, 234, 0.6);
		} */
.option .current {
  box-shadow: 0 0 0.106666rem 0 rgba(60, 205, 234, 0.8);
  border: solid 0.4px rgba(60, 205, 234, 0.6);
  color: #2e2e2e;
}

.page {
  height: 0.64rem;
  width: 6.933333rem;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 1.53335rem;
  bottom: 2.026666rem;
  z-index: 2;
  color: #c2efd5;
  font-size: 0.32rem;
}

.page em {
  padding: 0 0.15rem;
}

.page span {
  color: rgba(75, 134, 133, 1);
}

.arrow {
  width: 0.64rem;
  height: 0.64rem;
}
.arrow .flex {
  box-shadow: 0 0 0.106666rem 0 rgba(169, 169, 169, 0.4);
  background-color: #ffffff;
  width: 0.64rem;
  height: 0.64rem;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
}

.result {
  width: 9.146666rem;
  height: 1.06666rem;
  border-radius: 0.64rem;
  background-image: linear-gradient(to right, #42edff 1%, #3ccdea);
  position: fixed;
  bottom: 0.2666666rem;
  left: 0.43rem;
  font-size: 0.48rem;
  color: #ffffff;
  justify-content: center;
  align-items: center;
}

.van-icon {
  color: #2e2e2e;
}

.opacity {
  opacity: 0.5;
}
</style>