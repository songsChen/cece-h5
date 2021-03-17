<template>
    <div class="about">
        <div id="svgClass"></div>
    </div>
</template>
<script>
import SVGA from "svgaplayerweb";
export default {
    data() {
        return {};
    },
    mounted() {
        console.log(this.$route.query);
        this.playSvga();
    },
    methods: {
        playSvga() {
            const player = new SVGA.Player("#svgClass");
            var parser = new SVGA.Parser("#svgClass");
            //注意，这里必须是服务器地址，否则报错
            parser.load(
                "https://xxwolo.xxwolo.com/p_engine/apph5/activity/reports_year/loading.svga",
                function (videoItem) {
                    player.setVideoItem(videoItem);
                    player.startAnimation();
                }
            );
        },
    },
};
</script>
<style scoped lang="less">
#svgClass {
    width: 100vw;
    height: 100vh;
}
</style>
