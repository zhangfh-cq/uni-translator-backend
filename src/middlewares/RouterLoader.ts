import fs from 'fs';
import path from 'path';
import compose from 'koa-compose';
import  Router from 'koa-router';
import { IMiddleware } from 'koa-router';
import { ROOT_DIR } from '../common/config/Config';


// 自动加载路由中间件
function routerLoader() {
    const routerList: IMiddleware[] = []; // 路由中间件数组
    const routerFileList: string[] = fs.readdirSync(path.join(ROOT_DIR, 'routers')); // 路由文件列表

    for (let routerFile of routerFileList) {
        let routerFileName: string = routerFile.replace('.ts', '');
        let router: Router = require(path.join(ROOT_DIR, `routers`, routerFileName)).default;
        routerList.push(router.routes());
    }

    return compose(routerList); // 返回合成后的中间件
}

export default routerLoader;