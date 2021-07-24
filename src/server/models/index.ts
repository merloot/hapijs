import { Sequelize, } from 'sequelize-typescript';
import config from '../config/config';
import { User, } from './users/User';
import { Session, } from './users/Session';
import {Role} from "./users/Roles";

const sequelize = new Sequelize(config.dbLink, {
    dialect: 'postgres',
    models: [User, Session,Role],
    repositoryMode: true,
});
sequelize.sync();
sequelize.authenticate()
    .then(() => {
    console.log('Sequelize has established postgre connection successfully.');
    })
    .catch(err => {
        console.log('Sequelize was unable to connect to the database:', err);
    });
export default sequelize;
