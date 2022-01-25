import qs from 'qs';
import axios, { AxiosResponse } from "axios";
import EnWordModel from '../models/EnWordModel';
import HistoryModel from '../models/HistoryModel';
import NewWordModel from '../models/NewWordModel';
import CryptoTool from "../common/utils/CryptoTool";
import CustomError from '../common/errors/CustomError';
import { RESPONSE, BAIDU_TRANSLATOR } from "../common/config/Config";


class TranslateService {
    // 翻译
    public static async translate(query: string, from: string, to: string, userId: string): Promise<string> {
        try {
            // 盐
            const SALT: string = CryptoTool.getRandomData();
            // MD5签名
            const SIGN: string = CryptoTool.getHashDigest(BAIDU_TRANSLATOR.APPID + query + SALT + BAIDU_TRANSLATOR.KEY, 'md5');
            // 发起翻译请求
            const result: AxiosResponse<any, any> = await axios({
                url: BAIDU_TRANSLATOR.URL,
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    q: query,
                    from: from,
                    to: to,
                    appid: BAIDU_TRANSLATOR.APPID,
                    salt: SALT,
                    sign: SIGN
                })
            });
            const fromLang: string | undefined = result.data.from;
            const toLang: string | undefined = result.data.to;
            const translation: string | undefined = result.data.trans_result[0].dst;
            // 如果翻译成功
            if (fromLang && toLang && translation) {
                // 限制译文长度
                if (translation.length > 1000) {
                    throw new CustomError(RESPONSE.TRANSLATE_LENGTH_ERROR.CODE, RESPONSE.TRANSLATE_LENGTH_ERROR.MSG);
                }
                // 添加历史记录
                await HistoryModel.create({
                    origin_text: query,
                    translation: translation,
                    user_id: userId
                });
                // 中英互译判断合法单词
                if ((fromLang === 'zh' && toLang === 'en') || (fromLang === 'en' && toLang === 'zh')) {
                    const word: string = (fromLang === 'zh' && toLang === 'en') ? translation : query;
                    const zhTranslation: string = (fromLang === 'zh' && toLang === 'en') ? query : translation;
                    // 查找单词库
                    const foundWord = await EnWordModel.findOne({
                        where: {
                            word: word
                        }
                    });
                    // 查找对应的生词
                    const foundNewWord = await NewWordModel.findOne({
                        where: {
                            word: word,
                            user_id: userId
                        }
                    });
                    // 如果单词合法且没有对应生词
                    if (foundWord && !foundNewWord) {
                        await NewWordModel.create({
                            word: word,
                            translation: zhTranslation,
                            user_id: userId
                        });
                    }
                }
            } else {
                throw new CustomError(RESPONSE.TRANSLATE_ERROR.CODE, RESPONSE.TRANSLATE_ERROR.MSG);
            }
            // 返回译文
            return translation;
        } catch (error) {
            throw error;
        }
    }
}

export default TranslateService;