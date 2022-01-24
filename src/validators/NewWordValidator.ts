import Joi from 'joi';
import { Context, Next } from 'koa';
import CustomError from '../common/errors/CustomError';
import { JOI_SCHEMA, RESPONSE } from '../common/config/Config';


class NewWordValidator {
    // 获取生词校验
    public static getNewWordGetValidator() {
        return async (ctx: Context, next: Next) => {
            // 校验
            try {
                await Joi
                    .object({
                        start: JOI_SCHEMA.NEW_WORD.GET.START,
                        num: JOI_SCHEMA.NEW_WORD.GET.NUM
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.NEW_WORD_GET_VALIDATE_ERROR.CODE,
                    RESPONSE.NEW_WORD_GET_VALIDATE_ERROR.MSG + validateError.message);
            }
            // 启动下一个中间件
            await next();
        }
    }

    // 删除生词校验
    public static getNewWordDeleteValidator() {
        return async (ctx: Context, next: Next) => {
            // 校验
            try {
                await Joi
                    .object({
                        word: JOI_SCHEMA.NEW_WORD.DELETE.WORD
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.NEW_WORD_DELETE_VALIDATE_ERROR.CODE,
                    RESPONSE.NEW_WORD_DELETE_VALIDATE_ERROR.MSG + validateError.message);
            }
            // 启动下一个中间件
            await next();
        }
    }
}

export default NewWordValidator;