// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
let print_env = require("./print_env.js");
module.exports = {
    // 选项...
    chainWebpack: (config) => {
        if (process.env.VUE_APP_ENV === "analysis") {
            const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
                .BundleAnalyzerPlugin;
            config.plugin("bundle-analyzer").use(WebpackBundleAnalyzer);
        }
    },
    configureWebpack: (config) => {
        return {
            optimization: {
                //  分包，防止打包后单个js文件过大，影响加载速度，目前从默认的 app.js 中拆出来的包有babel,vue,swiper,以及其他依赖的集合,共四个包
                splitChunks: {
                    cacheGroups: {
                        babel: {
                            name: "chunk-babel",
                            test: /[\\/]node_modules[\\/](_)?core-js/,
                            chunks: "all",
                            priority: 4,
                            reuseExistingChunk: true,
                            enforce: true,
                        },
                        vue: {
                            name: "chunk-vue",
                            test: /[\\/]node_modules[\\/](_)?vue/,
                            chunks: "all",
                            priority: 3,
                            reuseExistingChunk: true,
                            enforce: true,
                        },
                        vendor: {
                            name: "chunk-vendor",
                            test: /[\\/]node_modules[\\/](_)?sa-sdk-javascript/,
                            chunks: "all",
                            priority: 1,
                            reuseExistingChunk: true,
                            enforce: true,
                        },
                    },
                },
            },
            devServer: {
                proxy: {
                    "/": {
                        target: print_env.GET_URL,
                        ws: false,
                        changeOrigin: true,
                        bypass: function(req, res, proxyOptions) {
                            if (req.headers.accept.indexOf("html") !== -1) {
                                console.log(
                                    "Skipping proxy for browser request.",
                                );
                                print_env.print();
                                return "/index.html";
                            }
                        },
                    },
                },
            },
        };
    },
};
