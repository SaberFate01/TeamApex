import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('loginDB', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
});

export default sequelize;
