import { DataTypes } from 'sequelize';
import sequelize from '../common/utils/Sequelize';

const NewWordModel = sequelize
    .define('new_word', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        word: {
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

export default NewWordModel;