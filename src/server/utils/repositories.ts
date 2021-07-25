import sequelize from "../models";
import {User} from "../models/users/User";
import {Role} from "../models/users/Roles";
import {Session} from "../models/users/Session";

export const userRepository = sequelize.getRepository(User);

export const sessionRepository = sequelize.getRepository(Session);

export const roleRepository = sequelize.getRepository(Role);
