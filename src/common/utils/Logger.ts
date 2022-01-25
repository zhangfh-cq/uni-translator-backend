import path from 'path';
import log4js, { Logger } from 'log4js';
import { ROOT_DIR } from '../config/Config';

// log4js设置
log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        APPDateFile: {
            type: 'dateFile',
            encoding: 'utf-8',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            filename: path.join(ROOT_DIR, 'logs/app/APP')
        },
        HTTPDateFile: {
            type: 'dateFile',
            encoding: 'utf-8',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            filename: path.join(ROOT_DIR, 'logs/http/HTTP')
        }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' },
        APP: { appenders: ['console', 'APPDateFile'], level: 'debug' },
        HTTP: { appenders: ['HTTPDateFile'], level: 'debug' }
    }
});

// 默认logger对象
const logger: Logger = log4js.getLogger('APP');

export { log4js, logger };