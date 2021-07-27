import {User} from "../models/users/User";
import {Role} from "../models/users/Roles";
import {baseRepository} from "./baseRepository";
import {IUserRepository} from "./interfaces/IUserRepository";

export class userRepository extends baseRepository<User> implements IUserRepository<User>{

    findUserByEmail(email): Promise<User | null>{
        return this.model.findOne({where:{email:email}})
    }

    getUsers(limit?:number,offset?:number):Promise<User| null>{
        return this.model.findAndCountAll({
            limit:limit,
            offset:offset,
            attributes:['email'],
            include:[{
                model: Role,
                attributes:['role']
            }],
        });
    }
}
