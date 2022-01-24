import { DataTypes } from 'sequelize';
import sequelize from '../common/utils/Sequelize';


const UserModel = sequelize
    .define('user', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        username: {
            type: DataTypes.STRING(12),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(254),
            unique: true,
            allowNull: false
        },
        email_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        email_code: {
            type: DataTypes.STRING(6),
            defaultValue: '******'
        },
        email_expire: {
            type: DataTypes.DATE,
            defaultValue: '1970-1-1 00:00:00'
        },
        autograph: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: '这个人很懒，没有设置签名'
        }
    }, {
        timestamps: true,
        createdAt: 'create_time',
        updatedAt: 'update_time'
    });

export default UserModel;