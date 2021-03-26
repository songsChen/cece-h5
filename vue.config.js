// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
let print_env = require("./print_env.js");
module.exports = {
    // 选项...
    publicPath: "./",
    chainWebpack: (config) => {
        // 移除 prefetch 插件，因为项目是非单页面，提前加载作用不大，所以移除prefetch插件
        config.plugins.delete("prefetch");
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
                    "/api": {
                        target: print_env.GET_URL,
                        pathRewrite: { "^/api": "" },
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
