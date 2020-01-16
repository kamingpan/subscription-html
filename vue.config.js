module.exports = {
  publicPath: './',

  // 它支持webPack-dev-server的所有选项
  devServer: {
    port: 8082, // 端口号
    host: '127.0.0.1',
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器
    proxy: {
      '/@': {
        target: 'http://127.0.0.1:8020/subscription',
        // target: 'http://www.kamingpan.com/subscription', // 设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          '^/@': ''// 这里理解成用‘/@’代替target里面的地址，后面组件中我们掉接口时直接用@代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/@/user/add’即可
        }
      }
    }
  }
}
