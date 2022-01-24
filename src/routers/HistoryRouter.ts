import Router from 'koa-router';
import { Context, Next } from 'koa';
import Response from '../common/types/Response';
import { RESPONSE } from '../common/config/Config';
import HistoryService from '../services/HistoryService';
import HistoryValidator from '../validators/HistoryValidator';

// 获取Router实例
const historyRouter: Router = new Router();

// 设置路由前缀
historyRouter.prefix('/history');

// 获取历史记录路由
historyRouter.post('/get', HistoryValidator.getHistoryGetValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id;
        const { start, num }: { start: number, num: number } = ctx.request.body;
        // 获取历史记录
        const historyArray: object[] = await HistoryService.get(userId, start, num);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: historyArray
        }
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    // 启动下一个中间件
    await next();
});

// 删除历史记录路由
historyRouter.post('/delete', HistoryValidator.getHistoryDeleteValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id;
        const { originText, translation }: { originText: string, translation: string } = ctx.request.body;
        // 删除历史
        await HistoryService.delete(userId, originText, translation);
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

export default historyRouter;