<template>
    <div id="app">
        <div class="loading-box" v-show="!ready">
            <div id="svg1" class="svg"></div>
        </div>
        <img class="share-tip" @click="getSharImgUrl" src="https://xxwolo.xxwolo.com/invalidName%403x.png" />
        <div class="type-list">
            <div class="list" v-for="(value, key) in list" :key="key" @click="toDetail(key)">
                <img class="backImg" :src="value.img" />
                <div class="head">
                    <img class="head-img" v-for="(item, index) in value.list" :src="item" :key="index" />
                    <img
                        class="more-icon"
                        v-show="value.list.length > 0"
                        :src="'https://xxwolo.xxwolo.com/r-m-' + key + '.png'"
                    />
                </div>
            </div>
        </div>
        <div id="shareImg">
            <div class="back"></div>
            <div class="shareImg-top">
                <div>
                    <p>{{ shareInfo.username }}</p>
                    <p>的九型人格测试结果是</p>
                </div>
                <div>
                    <img :src="'https://xxwolo.xxwolo.com/shareInfor/type-' + shareType + '.png'" />
                </div>
            </div>
            <div>
                <img
                    class="share-type-header"
                    :src="
                        'https://xxwolo.xxwolo.com/p_engine/psychology/images/nine/header/nine-header-' +
                        Number(shareType) +
                        '.png'
                    "
                />
            </div>

            <div class="share-content">
                <div>
                    <img
                        class="share-content-t"
                        :src="'https://xxwolo.xxwolo.com/shareInfor/type-' + shareType + '-t.png'"
                    />
                </div>
                <p class="share-content-des">你是啥类型？和谁最像？</p>
            </div>
            <div class="qr">
                <img src="https://xxwolo.xxwolo.com/invalid-name%403x.png" />
                <div id="qrCode" ref="qrCodeDiv"></div>
            </div>
        </div>
        <img :src="shareImgMaskUrl" />
    </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/utils/request";
import Vue from "vue";
import { Button } from "vant";
import SVGA from "svgaplayerweb";
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import { encode } from "js-base64";
Vue.use(Button);
export default {
    name: "Home",
    components: {},
    data() {
        return {
            ready: false,
            userId: this.$route.query.userId,
            shareImgMaskUrl: "",
            list: {},
            shareType: this.$route.query.shareType,
            shareInfo: {},
            qiniuToken: "",
        };
    },
    created() {
        this.loadingFN();
        this.getInit();
        this.getSharInfor();
    },

    mounted() {
        this.$nextTick(() => {
            var url = `https://www.xxwolo.com/p_engine/apph5/enneagram.html?userId=${this.userId}`;
            this.bindQRCode(url);
        });
        axios({
            url: "/psychology/nine_type_test/home", // 假地址 自行替换
            method: "get",
            params: {
                user_id: "stff2ba0756301a47c435aefee3e",
            },
        }).then((res) => {
            console.log(res);
        });
    },

    methods: {
        loadingFN: function () {
            this.$nextTick(() => {
                let _dom = "#svg1";
                let _imgsrc = "https://xxwolo.xxwolo.com/p_engine/apph5/activity/reports_year/loading.svga";
                let svga1 = new SVGA.Player(_dom);
                let svga2 = new SVGA.Parser(_dom); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
                svga2.load(_imgsrc, function (videoItem) {
                    svga1.setVideoItem(videoItem);
                    svga1.startAnimation();
                });
            });
        },
        getInit: function () {
            axios({
                url: "/psychology/nine_type_test/checkfriendslist", // 假地址 自行替换
                method: "get",
                params: {
                    userId: this.userId,
                },
            }).then((res) => {
                this.ready = true;
                this.list = res.data;
                console.log(this.list);
            });
        },
        getSharInfor() {
            axios({
                url: "/psychology/nine_type_test/getresultexplain", // 假地址 自行替换
                method: "get",
                params: {
                    userId: this.userId,
                    type: this.shareType,
                },
            }).then((res) => {
                this.shareInfo = res.data;
                console.log(res);
            });
        },
        toDetail(key) {
            this.$router.push({
                path: "/about",
                query: { userId: this.userId, shareType: this.shareType, chooseType: key },
            });
        },
        getSharImgUrl() {
            let shareInfo = {
                comment: "false",
                title: "",
                describe: "",
                share_url: this.shareImgMaskUrl,
                face: "",
                type: 2, //1-截图,2-分享图片,3-分享链接
                channel: ["wechat", "wechatCircle"],
                callback_url: "",
                icon_url: "https://cecemain.xxwolo.com/d37dbde954e1e98aa348967e167b3174.png",
                isH5ShareImg: true,
                imagePath: this.shareImgMaskUrl,
            };
            if (JSON.stringify(this.shareInfo) == "{}") {
                setTimeout(() => {
                    this.getSharImgUrl();
                }, 500);
            } else {
                if (this.shareImgMaskUrl) {
                    webShare.postMessage(JSON.stringify(shareInfo));
                    return;
                }
                new html2canvas(document.getElementById("shareImg"), {
                    backgroundColor: "transparent",
                    allowTaint: true,
                    useCORS: true,
                    scale: 2,
                    height: document.getElementById("shareImg").offsetHeight,
                    width: document.getElementById("shareImg").offsetWidth,
                    windowWidth: document.body.scrollWidth,
                    windowHeight: document.body.scrollHeight,
                    logging: false,
                    scrollY: 0, //安卓不设置会出现页面滑动后图片上方有白框
                    letterRendering: true,
                }).then((canvas) => {
                    var p1 = new Promise((resolve, reject) => {
                        axios({
                            url: "/user/qiniu/upload_image_token", // 假地址 自行替换
                            method: "get",
                            params: { usage: "community" },
                        }).then((res) => {
                            this.qiniuToken = res.data.token;
                            resolve(true);
                        });
                    }).then((res) => {
                        let that = this;
                        const key = "yearreview/" + randomWord(false, 32) + ".png";
                        let file = canvas.toDataURL("image/png");
                        var pic = file.replace("data:image/png;base64,", "");
                        let _key = encode(key);
                        var url = location.protocol + "//upload.qiniup.com/putb64/-1/key/" + _key; //非华东空间需要根据注意事项 1 修改上传域名
                        var xhr = new XMLHttpRequest();

                        xhr.open("POST", url, true);
                        xhr.setRequestHeader("Content-Type", "application/octet-stream");
                        xhr.setRequestHeader("Authorization", "UpToken " + that.qiniuToken);
                        xhr.send(pic);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                that.shareImgMaskUrl = JSON.parse(xhr.response).url;
                                let shareInfo = {
                                    comment: "false",
                                    title: "",
                                    describe: "",
                                    share_url: that.shareImgMaskUrl,
                                    face: "",
                                    type: 2, //1-截图,2-分享图片,3-分享链接
                                    channel: ["wechat", "wechatCircle"],
                                    callback_url: "",
                                    icon_url: "https://cecemain.xxwolo.com/d37dbde954e1e98aa348967e167b3174.png",
                                    isH5ShareImg: true,
                                    imagePath: that.shareImgMaskUrl,
                                };
                                webShare.postMessage(JSON.stringify(shareInfo));
                            }
                        };
                    });
                });
            }
        },
        bindQRCode: function (url) {
            let sc = document.documentElement.clientWidth / 375;
            console.log(sc);
            new QRCode(this.$refs.qrCodeDiv, {
                text: url,
                width: 74 * sc,
                height: 74 * sc,
                colorDark: "#333333", //二维码颜色
                colorLight: "#ffffff", //二维码背景色
                correctLevel: QRCode.CorrectLevel.L, //容错率，L/M/H
            });
        },
    },
};
function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
        pos;
    //随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}
</script>
<style scoped>
body {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    padding-top: 0.08rem;
    overflow-y: scroll;
}
.loading-box {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
}
#svg1 {
    width: 2rem;
    height: 4.37rem;
}

.share-tip {
    width: 3.43rem;
    height: 0.66rem;
    display: block;
    margin: 0 auto 0;
}

.type-list {
    display: flex;
    flex-wrap: wrap;
}

.type-list > .list {
    width: 1.04rem;
    height: 1.38rem;
    margin: 0.16rem 0 0 0.16rem;
    position: relative;
}

.type-list > .list > .backImg {
    width: 1.04rem;
    height: 1.38rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 1.04rem;
    height: 1.38rem;
}

.type-list > .list > .head {
    height: 0.32rem;
    position: absolute;
    bottom: 0.1rem;
    left: 0.08rem;
    display: flex;
    align-items: center;
}

.head-img {
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 50%;
    margin-left: -0.12rem;
}

.head-img:first-of-type {
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 50%;
    margin-left: 0rem !important;
}

.more-icon {
    width: 0.16rem;
    height: 0.16rem;
}

#shareImg {
    width: 3.43rem;
    height: 3.93rem;
    background: white;
    position: absolute;
    overflow: hidden;
    left: -150vw;

    /* position: fixed;
        left: -100vw; */
}

#shareImg > .back {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #fff3af;
    position: absolute;
    bottom: 193%;
    left: 0;
    transform: scale(3.7);
}

.shareImg-top {
    width: 3.43rem;
    height: 1.62rem;
    position: absolute;
    z-index: 99;
    display: flex;
    justify-content: space-between;
    padding: 0.24rem 0.24rem 0 0.24rem;
    box-sizing: border-box;
}

.shareImg-top > div > p {
    font-family: NotoSansCJKsc;
    font-size: 0.16rem;
    color: #2e2e2e;
    line-height: 1.25;
    margin-bottom: 0.08rem;
}

.shareImg-top > div > img {
    width: 0.9rem;
    height: 0.34rem;
    display: block;
}

.share-type-header {
    width: 1.5rem;
    height: 1rem;
    position: absolute;
    top: 1.08rem;
    left: 0.965rem;
    z-index: 100;
}

.share-content {
    padding-top: 2.21rem;
    font-size: 0;
}

.share-content-t {
    width: 2.01rem;
    height: 0.3rem;
    display: block;
    margin: auto;
}

.share-content-des {
    font-family: PingFangSC;
    font-size: 0.18rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.22;
    letter-spacing: normal;
    color: #2e2e2e;
    text-align: center;
    margin-top: 0.15rem;
}

.qr {
    position: relative;
    width: 3.43rem;
    height: 0.91rem;
    margin-top: 0.14rem;
    text-align: right;
    font-size: 0;
}

.qr > img {
    width: 3.43rem;
    height: 0.91rem;
    position: absolute;
    left: 0;
    top: 0;
}

#qrCode {
    width: 0.74rem;
    height: 0.74rem;
    display: inline-block;
    position: absolute;
    top: 0.09rem;
    right: 0.148rem;
}
</style>
