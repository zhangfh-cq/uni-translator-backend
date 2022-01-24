import { DataTypes} from 'sequelize';
import sequelize from '../common/utils/Sequelize';

const EnWordModel = sequelize
    .define('en_word', {
        word: {
            type: DataTypes.STRING(32),
            primaryKey: true
        },
        translation: {
            type: DataTypes.STRING(512),
            allowNull: false
        }
    });
export default EnWordModel;