import { Context, Next } from 'koa';
import Response from '../common/types/Response';
import { logger } from '../common/utils/Logger';
import { RESPONSE } from '../common/config/Config';
import CustomError from '../common/errors/CustomError';

// 错误处理中间件
function errorHandler() {
    return async function (ctx: Context, next: Next) {
        // 捕获错误
        try {
            // 执行下一个中间件
            await next();

            // 判断请求资源是否存在
            if (ctx.response.body === undefined) {
                throw new CustomError(RESPONSE.NOT_FOUND_ERROR.CODE, RESPONSE.NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            // 判断错误类型
            if (error instanceof CustomError) {
                // 打印错误日志
                const customError: CustomError = error as CustomError;
                logger.error(`${customError.name} ${customError.message}`);

                // 响应消息
                const response: Response = {
                    code: customError.getCode(),
                    msg: customError.getMessage(),
                    data: customError.getData()
                }
                ctx.response.body = response;
            } else {
                // 打印错误日志
                const unknownError: Error = error as Error;
                logger.error(`${unknownError.name} ${unknownError.message}\n${unknownError.stack}`);

                // 响应消息
                const response: Response = {
                    code: RESPONSE.UNKNOWN_ERROR.CODE,
                    msg: RESPONSE.UNKNOWN_ERROR.MSG,
                    data: null
                }
                ctx.response.body = response;
            }
        }
    }
}

export default errorHandler;