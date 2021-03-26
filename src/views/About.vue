<template>
    <div class="about">
        <div class="loading-box" v-show="!ready">
            <div id="svg1" class="svg"></div>
        </div>
        <img class="share-tip" src="https://xxwolo.xxwolo.com/invalidName%403x.png" />
        <div class="infor">
            <img
                class="h-title"
                :src="
                    'https://xxwolo.xxwolo.com/p_engine/psychology/images/nine/top/nine-' +
                    Number(infor.type_num) +
                    '.png'
                "
            />
            <img
                class="h-img"
                :src="
                    'https://xxwolo.xxwolo.com/p_engine/psychology/images/nine/header/nine-header-' +
                    Number(infor.type_num) +
                    '.png'
                "
            />
            <div class="section" :style="{ background: infor.majority_background_color }">
                <div class="item-title" :style="{ background: infor.majority_label_background_color }">典型人物</div>
                <div class="item-txt">{{ infor.typical_people }}</div>
                <div class="item-title" :style="{ background: infor.majority_label_background_color }">气质形象</div>
                <div class="item-txt">{{ infor.appearance }}</div>
                <div v-show="slide">
                    <div class="item-title" :style="{ background: infor.majority_label_background_color }">口头禅</div>
                    <div class="item-txt">{{ infor.pet_phrase }}</div>
                    <div class="item-title" :style="{ background: infor.majority_label_background_color }">
                        适合工作
                    </div>
                    <div class="item-txt">{{ infor.job }}</div>
                    <div class="item-title" :style="{ background: infor.majority_label_background_color }">
                        恋爱特征
                    </div>
                    <div class="item-txt">{{ infor.love }}</div>
                    <div style="height: 0.26rem"></div>
                </div>
            </div>
            <div v-show="slide" class="interpret-tip" :style="{ background: infor.get_along_background_color }">
                <div class="interpret-title" :style="{ background: infor.get_along_label_background_color }">
                    如何与ta相处
                </div>
                <div class="along-item" v-for="(item, index) in infor.get_along">
                    <div class="along-circle" :style="{ background: infor.get_along_list_tip_color }"></div>
                    <div class="along-txt">{{ item }}</div>
                </div>
            </div>
        </div>
        <div class="toogle" @click="slide = !slide">
            {{ slide ? "收起" : "展开" }}<span :class="slide ? 'toogleUp' : 'toogleDown'"></span>
        </div>
        <div class="friends-list" v-if="img_list.length > 0">
            <div class="friends-list-item" v-for="item in img_list">
                <img :src="item.headimgurl" />
                <p>{{ item.nickname }}</p>
            </div>
        </div>
        <div v-else>
            <img class="null-friends" src="https://xxwolo.xxwolo.com/basic-image-cece-empty%403x.png" />
            <div style="height: 0.33rem"></div>
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
    </div>
</template>
<script>
import axios from "@/utils/request";
import SVGA from "svgaplayerweb";
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import { encode } from "js-base64";
export default {
    components: {},
    data() {
        return {
            ready: false,
            userId: this.$route.query.userId,
            shareImgMaskUrl: "",
            chooseType: this.$route.query.chooseType,
            shareType: this.$route.query.shareType,
            infor: {},
            shareInfo: {},
            slide: false,
            img_list: [],
            qiniuToken: "",
        };
    },
    created() {
        this.loadingFN();
        this.getInit();
    },
    mounted() {
        this.$nextTick(() => {
            var url = `https://www.xxwolo.com/p_engine/apph5/enneagram.html?userId=${this.userId}`;
            this.bindQRCode(url);
        });
        // this.getSharInfor();
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
                url: "/psychology/nine_type_test/getfriendsdetail", // 假地址 自行替换
                method: "get",
                params: {
                    userId: this.userId,
                    type: this.chooseType,
                },
            }).then((res) => {
                if (res.code === 0) {
                    this.infor = res.data.type_detail;
                    this.img_list = res.data.img_list;

                    this.ready = true;
                }
                console.log(res);
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
        arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
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
<style scoped lang="less">
body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    box-sizing: border-box;
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
    z-index: 999;
}
#svg1 {
    width: 2rem;
    height: 4.37rem;
}

.share-tip {
    width: 3.43rem;
    height: 0.66rem;
    margin: 0rem auto 0;
    display: block;
}

.infor {
    margin-top: 0.32rem;
    padding: 0 0.16rem;
    position: relative;
    font-size: 0;
}

.section {
    padding-top: 0.69rem;
    padding-left: 0.16rem;
}

.h-title {
    position: absolute;
    width: 3.43rem;
    height: 0.66rem;
    top: -0.16rem;
    left: 0.16rem;
}

.h-img {
    width: 1.5rem;
    height: 1rem;
    position: absolute;
    top: 0.54rem;
    right: 0.25rem;
}

.item-title {
    height: 0.28rem;
    padding: 0 0.12rem;
    line-height: 0.28rem;
    display: inline-block;
    font-family: PingFangSC;
    font-size: 0.14rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    color: #2e2e2e;
    border-radius: 0.16rem;
}

.item-txt {
    padding: 0.06rem 0 0.14rem 0;
    font-family: PingFangSC;
    font-size: 0.14rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    color: #2e2e2e;
    line-height: 0.24rem;
}

.interpret-tip {
    margin: -0.24rem auto 0;
    width: 3.23rem;
    border-radius: 8px;
    padding: 0.15rem 0 0.16rem 0;
}

.interpret-title {
    width: 1.16rem;
    height: 0.32rem;
    line-height: 0.32rem;
    border-top-right-radius: 0.15rem;
    border-bottom-right-radius: 0.15rem;
    text-align: center;
    font-family: PingFangSC;
    font-size: 0.14rem;
    font-weight: bold;
    color: #2e2e2e;
}

.along-item {
    margin: 0.12rem 0 0rem 0.32rem;
    display: flex;
    align-items: center;
}

.along-circle {
    width: 0.08rem;
    height: 0.08rem;
    border-radius: 50%;
    margin-right: 0.08rem;
}

.along-txt {
    font-family: NotoSansCJKsc;
    font-size: 0.14rem;
    color: #2e2e2e;
}

.toogle {
    margin-top: 0.12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC;
    font-size: 0.14rem;
    color: #5f5f5f;
}

.toogle > span {
    width: 0.18rem;
    height: 0.18rem;
    margin-left: 0.04rem;
}

.toogleUp {
    background: url(https://xxwolo.xxwolo.com/cece-icon-function-cece-icon-drop-up-32-x-32-normal%403x.png);
    background-size: 100% 100%;
}

.toogleDown {
    background: url(https://xxwolo.xxwolo.com/cece-icon-function-cece-icon-drop-down-32-x-32-normal%403x.png);
    background-size: 100% 100%;
}

.friends-list {
    padding: 0.24rem 0.07rem 0.12rem 0.07rem;
    display: flex;
    flex-wrap: wrap;
    font-size: 0;
}

.friends-list > .friends-list-item {
    width: 0.9rem;
    text-align: center;
    margin-bottom: 0.12rem;
}

.friends-list-item > img {
    width: 0.48rem;
    height: 0.48rem;
    border-radius: 50%;
}

.friends-list-item > p {
    font-family: PingFangSC;
    font-size: 0.12rem;
    text-align: center;
    color: #2e2e2e;
    margin-top: 0.06rem;
}

.null-friends {
    width: 2.2rem;
    height: 2.19rem;
    display: block;
    margin: 0 auto 0.33rem;
}

#shareImg {
    width: 3.43rem;
    height: 3.93rem;
    background: white;
    position: fixed;
    overflow: hidden;
    left: 120vw;
    top: 0;
    font-size: 0;

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
    margin-bottom: 0;
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
