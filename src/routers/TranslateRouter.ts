import Router from "koa-router";
import { Context, Next } from "koa";
import Response from "../common/types/Response";
import { RESPONSE } from "../common/config/Config";
import TranslateService from "../services/TranslateService";
import TranslateValidator from "../validators/TranslateValidator";

// 获取Router实例
const translateRouter: Router = new Router();

// 设置路由前缀
translateRouter.prefix('/translate');

// 翻译路由
translateRouter.post('/', TranslateValidator.getTranslateValidator(), async (ctx: Context, next: Next) => {
    try {
        // 获取数据
        const userId: string = ctx.state.payload.user.id;
        const { query, from, to }: { query: string, from: string, to: string } = ctx.request.body;
        // 翻译
        const translation: string = await TranslateService.translate(query, from, to, userId);
        // 响应的数据
        const response: Response = {
            code: RESPONSE.SUCCESS.CODE,
            msg: RESPONSE.SUCCESS.MSG,
            data: {
                translation: translation
            }
        }
        // 启动下一个中间件
        ctx.response.body = response;
    } catch (error) {
        throw error;
    }
    await next();
});


export default translateRouter;