import { Logger } from 'log4js';
import { Context, Next } from 'koa';
import { log4js, logger } from '../common/utils/Logger';

// HTTP请求响应记录中间件
function httpLogger() {
    return async (ctx: Context, next: Next) => {
        const httpLogger: Logger = log4js.getLogger('HTTP');
        // 记录HTTP请求
        logger.info(`Accept: ${ctx.request.method} ${ctx.request.originalUrl}`);
        httpLogger.info(`Request: IP-"${ctx.request.ip}" Request-${JSON.stringify(ctx.request)}`);

        // 执行下一个中间件
        await next();

        // 记录HTTP响应
        logger.info(`Response: ${JSON.stringify(ctx.response.body)}`);
        httpLogger.info(`Response: Response-${JSON.stringify(ctx.response)} Body-${JSON.stringify(ctx.response.body)}\n`);
    }
}

export default httpLogger;