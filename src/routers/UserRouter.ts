import Router from 'koa-router';
import { Context, Next } from 'koa';
import Response from '../common/types/Response';
import UserService from '../services/UserService';
import { RESPONSE } from '../common/config/Config';
import UserModifyItem from '../common/types/UserModifyItem';
import UserValidator from '../validators/UserValidator';


// 获取Router实例
const userRouter: Router = new Router();

// 设置路由前缀
userRouter.prefix('/user');

// 登录路由
userRouter.post('/login', UserValidator.getLoginValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const { email, password }: { email: string, password: string } = ctx.request.body;
        // 获取token
        const token: string = await UserService.login(email, password);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: {
                token: token
            }
        }
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    // 执行下一个中间件
    await next();
});

// 注册路由
userRouter.post('/signup', UserValidator.getSignupValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const { email, username, password }: { email: string, username: string, password: string } = ctx.request.body;
        // 添加用户
        await UserService.signup(email, username, password);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: null
        };
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    // 执行下一个中间件
    await next();
});


// 用户信息路由
userRouter.post('/info', async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id;
        // 获取信息
        const userInfo: object = await UserService.getInfo(userId);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: userInfo
        }
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    // 执行下一个中间件
    await next();
});

// 修改信息路由
userRouter.post('/modify', UserValidator.getModifyValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id
        const modifyItems: UserModifyItem = ctx.request.body;
        // 修改信息
        await UserService.modify(userId, modifyItems);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: null
        }
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    // 执行下一个中间件
    await next();
});

// 注销路由
userRouter.post('/logoff', UserValidator.getLogoffValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id
        const password: string = ctx.request.body.password;
        // 注销用户
        await UserService.logoff(userId, password);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: null
        };
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    // 执行下一个中间件
    await next();
});

// 邮件激活路由
userRouter.post('/email/active', async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id
        // 发送激活码
        await UserService.getActiveEmailCode(userId);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: null
        };
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    // 执行下一个中间件
    await next();
});

// 邮箱激活码验证路由
userRouter.post('/email/verify', UserValidator.getEmailVerifyValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id
        const code: string = ctx.request.body.code;
        // 验证激活码
        await UserService.verifyEmailActiveCode(userId, code);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: null
        };
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    // 执行下一个中间件
    await next();
});

export default userRouter;