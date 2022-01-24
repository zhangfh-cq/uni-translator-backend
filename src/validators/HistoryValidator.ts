import Joi from 'joi';
import { Context, Next } from 'koa';
import CustomError from '../common/errors/CustomError';
import { JOI_SCHEMA, RESPONSE } from '../common/config/Config';


class HistoryValidator {
    // 获取历史记录校验
    public static getHistoryGetValidator() {
        return async (ctx: Context, next: Next) => {
            try {
                // 校验
                await Joi
                    .object({
                        start: JOI_SCHEMA.HISTORY.GET.START,
                        num: JOI_SCHEMA.HISTORY.GET.NUM
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.HISTORY_GET_VALIDATE_ERROR.CODE,
                    RESPONSE.HISTORY_GET_VALIDATE_ERROR.MSG + validateError.message);
            }
            // 启动下一个中间件
            await next();
        }
    }

    // 删除历史记录校验
    public static getHistoryDeleteValidator() {
        return async (ctx: Context, next: Next) => {
            try {
                // 校验
                await Joi
                    .object({
                        originText: JOI_SCHEMA.HISTORY.DELETE.ORIGIN_TEXT,
                        translation: JOI_SCHEMA.HISTORY.DELETE.TRANSLATION
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.HISTORY_DELETE_VALIDATE_ERROR.CODE,
                    RESPONSE.HISTORY_DELETE_VALIDATE_ERROR.CODE + validateError.message);
            }
            // 启动下一个中间件
            await next();
        }
    }
}

export default HistoryValidator;