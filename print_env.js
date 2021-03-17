let mapEnv = {
    test: "https://api-test.cece.com",
    production: "https://api.cece.com",
    default_desc: "自定义环境",
    test_desc: "测试环境",
    production_desc: "线上环境",
};
currentDev = process.env.VUE_APP_ENV || "default";
module.exports = {
    GET_URL: mapEnv[currentDev] || mapEnv.test,
    print: function() {
        let VUE_APP_DESC = mapEnv[currentDev]
            ? mapEnv[`${currentDev}_desc`]
            : mapEnv.default_desc;
        console.log(
            "\033[40;33m当前代码运行环境为\033[0m：\033[42;34m" +
                VUE_APP_DESC +
                "\033[0m\n\n\033[40;33m请求地址为\033[0m：\033[42;34m" +
                this.GET_URL +
                "\033[0m\n",
        );
    },
};
