import Joi from 'joi';
import { Context, Next } from 'koa';
import CustomError from '../common/errors/CustomError';
import { JOI_SCHEMA, RESPONSE } from '../common/config/Config';


class UserValidator {
    // 用户登录信息校验
    public static getLoginValidator() {
        return async (ctx: Context, next: Next) => {
            try {
                // 校验
                await Joi
                    .object({
                        email: JOI_SCHEMA.USER.EMAIL,
                        password: JOI_SCHEMA.USER.PASSWORD,
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.LOGIN_VALIDATE_ERROR.CODE,
                    RESPONSE.LOGIN_VALIDATE_ERROR.MSG + validateError.message);
            }
            // 执行下一个中间件
            await next();
        }
    }

    // 用户注册信息校验
    public static getSignupValidator() {
        return async (ctx: Context, next: Next) => {
            try {
                // 校验
                await Joi
                    .object({
                        username: JOI_SCHEMA.USER.USERNAME,
                        password: JOI_SCHEMA.USER.PASSWORD,
                        email: JOI_SCHEMA.USER.EMAIL
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.SIGNUP_VALIDATE_ERROR.CODE,
                    RESPONSE.SIGNUP_VALIDATE_ERROR.MSG + validateError.message);
            }
            // 执行下一个中间件
            await next();
        }
    }

    // 用户修改信息校验
    public static getModifyValidator() {
        return async (ctx: Context, next: Next) => {
            try {
                // isModify校验规则
                const IS_MODIFY_SCHEMA = Joi.bool().required();
                // 校验
                await Joi
                    .object()
                    .keys({
                        username: Joi.object({
                            isModify: IS_MODIFY_SCHEMA,
                            newUsername: Joi.any().when('isModify', { is: true, then: JOI_SCHEMA.USER.USERNAME })
                        }).required(),
                        password: Joi.object({
                            isModify: IS_MODIFY_SCHEMA,
                            oldPassword: Joi.any().when('isModify', { is: true, then: JOI_SCHEMA.USER.PASSWORD }),
                            newPassword: Joi.any().when('isModify', { is: true, then: JOI_SCHEMA.USER.PASSWORD })
                        }).required(),
                        email: Joi.object({
                            isModify: IS_MODIFY_SCHEMA,
                            newEmail: Joi.any().when('isModify', { is: true, then: JOI_SCHEMA.USER.EMAIL })
                        }).required(),
                        autograph: Joi.object({
                            isModify: IS_MODIFY_SCHEMA,
                            newAutograph: Joi.any().when('isModify', { is: true, then: JOI_SCHEMA.USER.AUTOGRAPH })
                        }).required()
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.USER_MODIFY_VALIDATE_ERROR.CODE,
                    RESPONSE.USER_MODIFY_VALIDATE_ERROR.MSG + validateError.message);
            }
            // 执行下一个中间件
            await next();
        }
    }

    // 注销用户校验
    public static getLogoffValidator() {
        return async (ctx: Context, next: Next) => {
            try {
                // 校验
                await Joi
                    .object({
                        password: JOI_SCHEMA.USER.PASSWORD
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.USER_LOGOFF_VALIDATE_ERROR.CODE,
                    RESPONSE.USER_LOGOFF_VALIDATE_ERROR.MSG + validateError.message);
            }
            // 执行下一个中间件
            await next();
        }
    }

    // 邮箱激活码校验
    public static getEmailVerifyValidator() {
        return async (ctx: Context, next: Next) => {
            try {
                // 校验
                await Joi
                    .object({
                        code: JOI_SCHEMA.USER.EMAIL_CODE
                    })
                    .validateAsync(ctx.request.body);
            } catch (error) {
                const validateError: Error = error as Error;
                throw new CustomError(RESPONSE.EMAIL_ACTIVE_VALIDATE_ERROR.CODE,
                    RESPONSE.EMAIL_ACTIVE_VALIDATE_ERROR.MSG + validateError.message);
            }
            // 执行下一个中间件
            await next();
        }
    }
}

export default UserValidator;