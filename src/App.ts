import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { logger } from './common/utils/Logger';
import { RUN_PORT } from './common/config/Config';
import httpLogger from './middlewares/HttpLogger';
import errorHandler from './middlewares/ErrorHandler';
import routerLoader from './middlewares/RouterLoader';
import tokenVerifier from './middlewares/TokenVerifier';


// 启动App
new Koa()
    .use(httpLogger()) // Http日志记录中间件
    .use(errorHandler()) // 错误处理中间件
    .use(tokenVerifier()) // Token校验中间件
    .use(bodyParser()) // 解析请求Body中间件
    .use(routerLoader()) // 自动加载路由中间件
    .listen(RUN_PORT, () => {
        logger.info(`The APP is running on port ${RUN_PORT}.`);
    });