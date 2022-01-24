import Router from 'koa-router';
import { Context, Next } from 'koa';
import Response from '../common/types/Response';
import { RESPONSE } from '../common/config/Config';
import NewWordService from '../services/NewWordService';
import NewWordValidator from '../validators/NewWordValidator';

// 获取Router实例
const newWordRouter: Router = new Router();

// 设置路由前缀
newWordRouter.prefix('/new-word');

// 生词获取路由
newWordRouter.post('/get', NewWordValidator.getNewWordGetValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id;
        const { start, num }: { start: number, num: number } = ctx.request.body;
        // 获取生词
        const newWordArray: object[] = await NewWordService.get(userId, start, num);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: newWordArray
        }
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    // 启动下一个中间件
    await next();
});

// 生词删除路由
newWordRouter.post('/delete', NewWordValidator.getNewWordDeleteValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id;
        const word: string = ctx.request.body.word;
        // 删除生词
        await NewWordService.delete(userId, word);
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
    // 启动下一个中间件
    await next();
});

export default newWordRouter;