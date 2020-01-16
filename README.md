# subscription-html (vue + mintUI)
公众号页面<br>
> 可扫码关注公众号预览
![测试公众号](http://mmbiz.qpic.cn/mmbiz_jpg/GWZ8YfoWJS8nmOSBqVYnVmGNqbylxbK2iaKSwS4kY16LR95quCicurYrTVvfMY4fvrgUcCibECOwoe2QIkN73mzKg/0 "测试公众号")

## 项目介绍
该项目是vue + webpack + mintUI的前端页面，适配后端公众号框架，因此需要和公众号接口搭配使用，接口详见传送门：[公众号接口源码](https://github.com/kamingpan/infrastructure/tree/master/infrastructure-subscription "infrastructure-subscription")

## 项目下载
```
git clone https://github.com/kamingpan/subscription-html.git

cd subscription-html
```

## 项目安装
```
npm install
```

### 修改配置文件
.env.development（开发环境配置）<br>
.env.production（生产环境配置）<br>
vue.config.js（本地代理配置）

### 编译和运行（开发环境）
```
npm run serve
```

### 编译和打包（生产环境）
```
npm run build
```

### 访问本地页面
[微信开发者工具](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Web_Developer_Tools.html "微信开发者工具")<br>
打开微信开发者工具，输入地址：http://127.0.0.1:8082/ 访问<br>

### 补充说明
如果没有正式的公众号，可以前往[测试公众号页面](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login "测试公众号页面")，微信扫码登录即可获取一个测试公众号，权限和服务号一样，可用于公众号的开发、调试和预览。

#### 技术交流
如果您有任何疑问或者建议，可以通过邮箱联系本人：`kamingpan@qq.com`。
