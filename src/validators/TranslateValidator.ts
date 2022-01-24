import Joi from 'joi';
import { Context, Next } from 'koa';
import CustomError from '../common/errors/CustomError';
import { RESPONSE, JOI_SCHEMA } from '../common/config/Config';

// 翻译数据校验器
class TranslateValidator {
    public static getTranslateValidator() {
        return async (ctx: Context, next: Next) => {
            try {
                // 校验
                await Joi
                    .object({
                        query: JOI_SCHEMA.TRANSLATE.QUERY,
                        from: JOI_SCHEMA.TRANSLATE.FROM,
                        to: JOI_SCHEMA.TRANSLATE.TO
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.TRANSLATE_VALIDATE_ERROR.CODE,
                    RESPONSE.TRANSLATE_VALIDATE_ERROR.MSG + validateError.message);
            }
            // 启动下一个中间件
            await next();
        }
    }
}

export default TranslateValidator;