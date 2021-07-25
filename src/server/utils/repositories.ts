import sequelize from "../models";
import {User} from "../models/users/User";
import {Role} from "../models/users/Roles";
import {Session} from "../models/users/Session";
import {userRepository} from "../repositories/userRepository";
import {sessionRepository} from "../repositories/sessionRepository";

export const UserRepository = new userRepository(User);

export const SessionRepository = new sessionRepository(Session);

export const roleRepository = sequelize.getRepository(Role);
