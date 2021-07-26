import {Role} from "./users/Roles";
import { User, } from './users/User';
import config from '../config/config';
import { Session, } from './users/Session';
import { Sequelize, } from 'sequelize-typescript';

const sequelize = new Sequelize(config.dbLink, {
    dialect: 'postgres',
    models: [User, Session,Role],
});

sequelize.sync();
sequelize.authenticate()
    .then(() => {
    console.log('Sequelize has established postgre connection successfully.');
    })
    // .then(()=>{
    //     Role.bulkCreate([
    //         {role:'banned'},
    //         {role:'buyer'},
    //         {role:'develop_project'},
    //         {role:'admin'},
    //         {role:'super_admin'},
    //     ]).catch((err) => console.log(err));
    // })
    .catch(err => {
        console.log('Sequelize was unable to connect to the database:', err);
    });
export default sequelize;
