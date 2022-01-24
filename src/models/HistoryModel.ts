import { DataTypes, } from 'sequelize';
import sequelize from '../common/utils/Sequelize';


const HistoryModel = sequelize
    .define('history', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        origin_text: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        translation: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        timestamps: true,
        createdAt: 'create_time',
        updatedAt: false
    });

export default HistoryModel;