import moment from 'moment';
import Jwt from 'jsonwebtoken';
import { Model } from 'sequelize';
import User from '../common/types/User';
import mailer from '../common/utils/Mailer';
import UserModel from "../models/UserModel";
import { logger } from '../common/utils/Logger';
import HistoryModel from '../models/HistoryModel';
import NewWordModel from '../models/NewWordModel';
import UserModifyItem from '../common/types/UserModifyItem';
import CryptoTool from '../common/utils/CryptoTool';
import CustomError from '../common/errors/CustomError';
import { EMAIL, RESPONSE, TOKEN } from '../common/config/Config';


class UserService {
    // 登录
    public static async login(email: string, password: string): Promise<string> {
        try {
            // 根据邮箱查找用户
            const foundUser: User = (await UserModel.findOne({
                where: {
                    email: email
                }
            }))?.get();
            // 判断用户是否存在
            if (foundUser) {
                // 对密码进行加盐Hash
                password = CryptoTool.getHashDigest(password + foundUser.salt);
                // 验证密码
                if (password === foundUser.password) {
                    logger.info(`User ${foundUser.email} login succeeded.`);
                    // 签发Token
                    return Jwt.sign({ user: { id: foundUser.id } }, TOKEN.SECRET, { expiresIn: TOKEN.EXPIRE });
                } else {
                    throw new CustomError(RESPONSE.PASSWORD_ERROR.CODE, RESPONSE.PASSWORD_ERROR.MSG);
                }
            } else {
                throw new CustomError(RESPONSE.USER_NOT_FOUND_ERROR.CODE, RESPONSE.USER_NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            throw error;
        }
    }

    // 注册
    public static async signup(email: string, username: string, password: string): Promise<void> {
        try {
            // 查找邮箱是否已经存在
            const foundEmail: string | null = (await UserModel.findOne({
                where: {
                    email: email
                }
            }))?.getDataValue('email');
            // 如果邮箱不存在
            if (!foundEmail) {
                // 创建新用户
                const newUser: User = {
                    username: username,
                    password: password,
                    salt: CryptoTool.getRandomData(),
                    email: email
                }
                // Sha256+Salt加密密码
                newUser.password = CryptoTool.getHashDigest(newUser.password + newUser.salt);
                // 新增用户
                await UserModel.create(newUser);
                logger.info(`User: ${newUser.email} signup succeeded.`);
            } else {
                throw new CustomError(RESPONSE.EMAIL_EXISTS_ERROR.CODE, RESPONSE.EMAIL_EXISTS_ERROR.MSG);
            }
        } catch (error) {
            throw error;
        }
    }

    // 获取信息
    public static async getInfo(userId: string): Promise<object> {
        try {
            // 根据ID查找用户
            const userModel: Model | null = await UserModel.findOne({
                attributes: ['username', 'email', ['email_active', 'emailActive'], 'autograph', ['create_time', 'createTime']],
                where: {
                    id: userId
                }
            });
            // 如果存在
            if (userModel) {
                return userModel.get();
            } else {
                throw new CustomError(RESPONSE.USER_NOT_FOUND_ERROR.CODE, RESPONSE.USER_NOT_FOUND_ERROR.MSG);
            }
        } catch (err) {
            throw err;
        }
    }

    // 修改信息
    public static async modify(userId: string, modifyItems: UserModifyItem): Promise<void> {
        try {
            // 根据ID查找用户
            const foundUser: User | null = (await UserModel.findOne({
                where: {
                    id: userId
                }
            }))?.get();
            // 判断用户是否存在
            if (foundUser) {
                // 修改用户名
                if (modifyItems.username.isModify) {
                    foundUser.username = modifyItems.username.newUsername;
                }
                // 修改用户密码
                if (modifyItems.password.isModify) {
                    modifyItems.password.oldPassword = CryptoTool.getHashDigest(modifyItems.password.oldPassword + foundUser.salt);
                    // 校验旧密码是否正确
                    if (modifyItems.password.oldPassword === foundUser.password) {
                        foundUser.salt = CryptoTool.getRandomData();
                        foundUser.password = CryptoTool.getHashDigest(modifyItems.password.newPassword + foundUser.salt);
                    } else {
                        throw new CustomError(RESPONSE.PASSWORD_ERROR.CODE, RESPONSE.PASSWORD_ERROR.MSG);
                    }
                }
                // 修改邮箱
                if (modifyItems.email.isModify) {
                    foundUser.email = modifyItems.email.newEmail;
                    foundUser.email_active = false;
                    foundUser.email_code = '******';
                    foundUser.email_expire = '1970-1-1 00:00:00';
                }
                // 修改签名
                if (modifyItems.autograph.isModify) {
                    foundUser.autograph = modifyItems.autograph.newAutograph;
                }
                // 保存更改
                await UserModel.update(foundUser, { where: { id: foundUser.id } });
                logger.info(`User ${foundUser.email} information modification completed.`);
            } else {
                throw new CustomError(RESPONSE.USER_NOT_FOUND_ERROR.CODE, RESPONSE.USER_NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            throw error;
        }
    }

    // 注销
    public static async logoff(userId: string, password: string): Promise<void> {
        try {
            // 根据ID查找用户
            const foundUserModel: Model | null = await UserModel.findOne({
                where: {
                    id: userId
                }
            });
            // 判断用户是否存在
            if (foundUserModel) {
                const foundUser: User = foundUserModel.get();
                password = CryptoTool.getHashDigest(password + foundUser.salt);
                // 验证密码
                if (password === foundUser.password) {
                    // 删除用户
                    await foundUserModel.destroy();
                    // 删除历史记录
                    const historyModelArray: Model<any, any>[] = await HistoryModel.findAll({
                        where: {
                            user_id: userId
                        }
                    });
                    historyModelArray.forEach(async (historyModel) => {
                        await historyModel.destroy();
                    });
                    // 删除生词记录
                    const newWordModelArray: Model<any, any>[] = await NewWordModel.findAll({
                        where: {
                            user_id: userId
                        }
                    });
                    newWordModelArray.forEach(async (newWordModel) => {
                        await newWordModel.destroy();
                    });
                    logger.info(`User ${foundUser.email} logoff succeeded.`);
                } else {
                    throw new CustomError(RESPONSE.PASSWORD_ERROR.CODE, RESPONSE.PASSWORD_ERROR.MSG);
                }
            } else {
                throw new CustomError(RESPONSE.USER_NOT_FOUND_ERROR.CODE, RESPONSE.USER_NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            throw error;
        }
    }

    // 获取邮箱激活码
    public static async getActiveEmailCode(userId: string): Promise<void> {
        try {
            // 查找用户是否存在
            const foundUser: User | null = (await UserModel.findOne({
                where: {
                    id: userId
                }
            }))?.get();
            // 判断用户是否存在
            if (foundUser) {
                const intervalTime: number = moment().add(4, 'm').diff(moment(foundUser.email_expire));
                // 如果距离上次发送验证码超过一分钟
                if (intervalTime > 0) {
                    const activeCode: string = Math.random().toString().slice(2, 8);
                    await mailer.sendMail({
                        from: `${EMAIL.SENDER_NAME}<${EMAIL.SENDER_MAIL}>`,
                        to: foundUser.email,
                        subject: '邮箱激活',
                        text: `您的验证码为: ${activeCode},请在5分钟内使用`,
                        html: `<h4>您的验证码为: ${activeCode},请在5分钟内使用</h4>`
                    });
                    // 保存激活码和过期时间
                    foundUser.email_code = activeCode;
                    foundUser.email_expire = moment().add(5, 'm').format('YYYY-MM-DD HH:mm:ss');
                    await UserModel.update(foundUser, { where: { id: userId } });
                } else {
                    throw new CustomError(RESPONSE.EMAIL_ACTIVE_WAIT_ERROR.CODE, RESPONSE.EMAIL_ACTIVE_WAIT_ERROR.MSG);
                }
            } else {
                throw new CustomError(RESPONSE.USER_NOT_FOUND_ERROR.CODE, RESPONSE.USER_NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            throw error;
        }
    }

    // 邮箱激活验证
    public static async verifyEmailActiveCode(userId: string, code: string): Promise<void> {
        try {
            // 查找用户是否存在
            const foundUser: User | null = (await UserModel.findOne({
                where: {
                    id: userId
                }
            }))?.get();
            // 判断用户是否存在
            if (foundUser) {
                const intervalTime: number = moment().diff(moment(foundUser.email_expire));
                // 检查是否过期
                if (intervalTime < 0) {
                    // 比对激活码
                    if (code === foundUser.email_code) {
                        // 激活成功，更新数据
                        foundUser.email_active = true;
                        UserModel.update(foundUser, { where: { id: userId } });
                    } else {
                        throw new CustomError(RESPONSE.EMAIL_CODE_ERROR.CODE, RESPONSE.EMAIL_CODE_ERROR.MSG);
                    }
                } else {
                    throw new CustomError(RESPONSE.EMAIL_CODE_EXPIRED_ERROR.CODE, RESPONSE.EMAIL_CODE_EXPIRED_ERROR.MSG);
                }
            } else {
                throw new CustomError(RESPONSE.USER_NOT_FOUND_ERROR.CODE, RESPONSE.USER_NOT_FOUND_ERROR.MSG);
            }
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;