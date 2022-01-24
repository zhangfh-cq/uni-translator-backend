import { Sequelize } from 'sequelize';
import { DATABASE } from '../config/Config';

// 实例化ORM框架Sequelize
const sequelize: Sequelize = new Sequelize(
    DATABASE.NAME,
    DATABASE.USERNAME,
    DATABASE.PASSWORD,
    {
        host: DATABASE.HOST,
        port: DATABASE.PORT,
        dialect: 'mysql',
        define: {
            timestamps: false
        },
        timezone: '+08:00',
        logging: false
    }
);

// 连接检查
(async function () {
    try {
        // 测试连接
        await sequelize.authenticate();
        // 如果表不存在就创建表
        await sequelize.sync();
    } catch (error) {
        throw error;
    }
})();

export default sequelize;