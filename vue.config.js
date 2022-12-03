const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
   //代理跨域
   devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8888",
        // pathRewrite: {
        //   "/api": "", 把带有/api的转换成空串
        // },
        //changeOrigin:true 用于控制请求头中的host值
      },
    },
  },
})
