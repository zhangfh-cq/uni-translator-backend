#### 说明

该项目是UniTranslator后端，基于node.js+typescript+koa2+mysql+sequelize。

单词库来自：[103976](https://github.com/1eez/103976)，配套的前端项目：

Gitee: [uni-translator-frontend](https://gitee.com/youyouzhang/uni-translator-frontend)

Github: [uni-translator-frontend](https://github.com/zhangfh-cq/uni-translator-frontend)

#### 运行

首先开通[百度翻译开放平台](http://api.fanyi.baidu.com/)通用翻译和邮箱SMTP功能，准备MySQL和Node.js环境。然后导入根目录下的uni-translator.sql文件，配置src/common/config/Config.ts的必改项目，再运行:

```
npm install
```

```
npm run start
```



