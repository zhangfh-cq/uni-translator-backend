import { Model } from "sequelize";
import HistoryModel from "../models/HistoryModel";
import { RESPONSE } from "../common/config/Config";
import CustomError from "../common/errors/CustomError";

class HistoryService {
    // 获取历史记录
    public static async get(userId: string, start: number, num: number): Promise<object[]> {
        try {
            // 查找历史记录
            const HistoryModelArray: Model<any, any>[] = await HistoryModel.findAll({
                attributes: [['origin_text', 'originText'], 'translation'],
                offset: start - 1,
                limit: num,
                order: [['create_time', 'DESC']],
                where: {
                    user_id: userId
                }
            });
            // 判断是否找到
            if (HistoryModelArray) {
                const historyArray: object[] = [];
                // 遍历Model获取数据
                HistoryModelArray.forEach((historyModel: Model) => {
                    historyArray.push(historyModel.get());
                });
                // 返回历史记录对象数组
                return historyArray;
            } else {
                throw new CustomError(RESPONSE.HISTORY_NOT_FOUND_ERROR.CODE, RESPONSE.HISTORY_NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            throw error;
        }
    }

    // 删除历史记录
    public static async delete(userId: string, originText: string, translation: string): Promise<void> {
        try {
            // 查找历史记录
            const historyModel: Model<any, any> | null = await HistoryModel.findOne({
                where: {
                    origin_text: originText,
                    translation: translation,
                    user_id: userId
                }
            });
            // 如果找到
            if (historyModel) {
                // 删除历史记录
                await historyModel.destroy();
            } else {
                throw new CustomError(RESPONSE.HISTORY_NOT_FOUND_ERROR.CODE, RESPONSE.HISTORY_NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            throw error;
        }
    }
}

export default HistoryService;