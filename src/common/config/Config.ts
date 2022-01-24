import Joi from 'joi';
import path from 'path';

// 必改项目
// 数据库配置
export const DATABASE = {
    HOST: 'localhost',
    PORT: 3306,
    NAME: 'uni_translator',
    USERNAME: 'root',
    PASSWORD: '' // 必修改项
}

// Token配置
export const TOKEN = {
    SECRET: '', // 必修改项
    EXPIRE: 3 * 24 * 60 * 60,
    WHITE_LIST_PATHS: [/^\/user\/login/, /^\/user\/signup/]
}

// 邮箱SMTP配置
export const EMAIL = {
    HOST: 'smtp.163.com',
    PORT: 465,
    SECURE: true,
    USER: 'xxxx@163.com', // 必修改项
    PASS: 'xxxxxxxxxxx', // 必修改项
    SENDER_NAME: '翻译君',
    SENDER_MAIL: 'xxxx@163.com', // 必修改项
}

// 百度翻译开放平台配置
export const BAIDU_TRANSLATOR = {
    APPID: '', // 必修改项
    KEY: '', // 必修改项
    URL: 'https://fanyi-api.baidu.com/api/trans/vip/translate'
}


// 可改项目
// 运行端口配置
export const RUN_PORT: number = 8080;

// 项目根路径
export const ROOT_DIR: string = path.resolve(__dirname, '../..');

// 数据校验配置
export const JOI_SCHEMA = {
    USER: {
        USERNAME: Joi.string().min(1).max(12).required(),
        PASSWORD: Joi.string().length(32).required(),
        EMAIL: Joi.string().min(5).max(254).email().required(),
        EMAIL_CODE: Joi.string().length(6).required(),
        AUTOGRAPH: Joi.string().min(1).max(20).required()
    },
    TRANSLATE: {
        QUERY: Joi.string().min(1).max(1000).required(),
        FROM: Joi.string().min(2).max(4).required(),
        TO: Joi.string().min(2).max(3).required()
    },
    HISTORY: {
        GET: {
            START: Joi.number().integer().min(1).max(100).required(),
            NUM: Joi.number().integer().min(1).max(100).required()
        },
        DELETE: {
            ORIGIN_TEXT: Joi.string().min(1).max(1000).required(),
            TRANSLATION: Joi.string().min(1).max(1000).required()
        }
    },
    NEW_WORD: {
        GET: {
            START: Joi.number().integer().min(1).max(100).required(),
            NUM: Joi.number().integer().min(1).max(100).required()
        },
        DELETE: {
            WORD: Joi.string().min(1).max(32).required()
        }
    }
}

// 响应消息配置
export const RESPONSE = {
    SUCCESS: {
        CODE: 0,
        MSG: 'success'
    },
    UNKNOWN_ERROR: {
        CODE: 6000,
        MSG: '未知错误'
    },
    NOT_FOUND_ERROR: {
        CODE: 6001,
        MSG: '请求资源不存在'
    },
    TOKEN_INVALID_ERROR: {
        CODE: 6100,
        MSG: '无效TOKEN'
    },
    TOKEN_EXPIRED_ERROR: {
        CODE: 6101,
        MSG: 'TOKEN已过期'
    },
    SIGNUP_VALIDATE_ERROR: {
        CODE: 6200,
        MSG: '注册参数错误: '
    },
    EMAIL_EXISTS_ERROR: {
        CODE: 6201,
        MSG: '邮箱已被注册'
    },
    LOGIN_VALIDATE_ERROR: {
        CODE: 6202,
        MSG: '登录参数错误: '
    },
    USER_NOT_FOUND_ERROR: {
        CODE: 6203,
        MSG: '未发现该用户'
    },
    PASSWORD_ERROR: {
        CODE: 6204,
        MSG: '用户名或密码错误'
    },
    USER_MODIFY_VALIDATE_ERROR: {
        CODE: 6205,
        MSG: '修改参数错误: '
    },
    USER_LOGOFF_VALIDATE_ERROR: {
        CODE: 6206,
        MSG: '注销参数错误: '
    },
    EMAIL_ACTIVE_VALIDATE_ERROR: {
        CODE: 6207,
        MSG: '邮箱激活参数错误: '
    },
    EMAIL_ACTIVE_WAIT_ERROR: {
        CODE: 6208,
        MSG: '请等待当前激活码过期'
    },
    EMAIL_CODE_EXPIRED_ERROR: {
        CODE: 6209,
        MSG: '激活码已过期'
    },
    EMAIL_CODE_ERROR: {
        CODE: 6210,
        MSG: '激活码错误'
    },
    TRANSLATE_VALIDATE_ERROR: {
        CODE: 6300,
        MSG: '翻译参数错误: '
    },
    TRANSLATE_LENGTH_ERROR: {
        CODE: 6301,
        MSG: '译文过长'
    },
    TRANSLATE_ERROR: {
        CODE: 6302,
        MSG: '翻译失败，请稍后再试'
    },
    HISTORY_GET_VALIDATE_ERROR: {
        CODE: 6400,
        MSG: '历史记录获取参数错误: '
    },
    HISTORY_DELETE_VALIDATE_ERROR: {
        CODE: 6401,
        MSG: '历史记录删除参数错误: '
    },
    HISTORY_NOT_FOUND_ERROR: {
        CODE: 6402,
        MSG: '未找到历史记录'
    },
    NEW_WORD_GET_VALIDATE_ERROR: {
        CODE: 6500,
        MSG: '生词记录获取参数错误: '
    },
    NEW_WORD_NOT_FOUND_ERROR: {
        CODE: 6501,
        MSG: '未找到生词记录'
    },
    NEW_WORD_DELETE_VALIDATE_ERROR: {
        CODE: 6502,
        MSG: '生词记录删除参数错误: '
    },
}