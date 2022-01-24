import Jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';
import { TokenExpiredError } from 'jsonwebtoken';
import CustomError from '../common/errors/CustomError';
import { TOKEN, RESPONSE } from '../common/config/Config';


function tokenVerifier() {
    return async function (ctx: Context, next: Next) {
        try {
            // 正则检查是否为白名单路径
            let isWhiteList: boolean = false;
            TOKEN.WHITE_LIST_PATHS.forEach((regExp: RegExp) => {
                if (regExp.test(ctx.request.originalUrl)) {
                    isWhiteList = true;
                }
            });
            // 非白名单路径校验Token
            if (!isWhiteList) {
                // 请求头是否有Authorization
                if (ctx.request.header.authorization) {
                    try {
                        ctx.state.payload = Jwt.verify(ctx.request.header.authorization, TOKEN.SECRET);
                    } catch (error) {
                        if (error instanceof TokenExpiredError) {
                            throw new CustomError(RESPONSE.TOKEN_EXPIRED_ERROR.CODE, RESPONSE.TOKEN_EXPIRED_ERROR.MSG);
                        } else {
                            throw new CustomError(RESPONSE.TOKEN_INVALID_ERROR.CODE, RESPONSE.TOKEN_INVALID_ERROR.MSG);
                        }
                    }
                } else {
                    throw new CustomError(RESPONSE.TOKEN_INVALID_ERROR.CODE, RESPONSE.TOKEN_INVALID_ERROR.MSG);
                }
            }
        } catch (error) {
            throw error;
        }
        // 启动下一个中间件
        await next();
    }
}

export default tokenVerifier;