import { Model } from 'sequelize';
import NewWordModel from '../models/NewWordModel';
import { RESPONSE } from '../common/config/Config';
import CustomError from '../common/errors/CustomError';

class NewWordService {
    // 获取生词
    public static async get(userId: string, start: number, num: number): Promise<object[]> {
        try {
            // 查找生词
            const NewWordModelArray: Model<any, any>[] = await NewWordModel.findAll({
                attributes: ['word', 'translation'],
                offset: start - 1,
                limit: num,
                order: [['create_time', 'DESC']],
                where: {
                    user_id: userId
                }
            });
            // 判断是否找到
            if (NewWordModelArray) {
                const newWordArray: object[] = [];
                // 遍历Model获取数据
                NewWordModelArray.forEach((newWordModel: Model) => {
                    newWordArray.push(newWordModel.get());
                });
                // 返回生词记录对象数组
                return newWordArray;
            } else {
                throw new CustomError(RESPONSE.NEW_WORD_NOT_FOUND_ERROR.CODE, RESPONSE.NEW_WORD_NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            throw error;
        }
    }

    // 删除生词
    public static async delete(userId: string, word: string): Promise<void> {
        try {
            // 查找生词
            const newWordModel: Model<any, any> | null = await NewWordModel.findOne({
                where: {
                    word: word,
                    user_id: userId
                }
            });
            // 如果存在
            if (newWordModel) {
                // 删除生词
                await newWordModel.destroy();
            } else {
                throw new CustomError(RESPONSE.NEW_WORD_NOT_FOUND_ERROR.CODE, RESPONSE.NEW_WORD_NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            throw error
        }
    }
}

export default NewWordService;