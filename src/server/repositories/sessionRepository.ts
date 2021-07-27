import {User} from "../models/users/User";
import {baseRepository} from "./baseRepository";
import {Session} from "../models/users/Session";
import {ISessionRepository} from "./interfaces/ISessionRepository";

export class sessionRepository extends baseRepository<Session> implements ISessionRepository<Session>{

    findUserById(id:string):Promise<Session| null>{
        return this.model.findOne({
            where:{user_id: id},
            include:[{
                model: User,
                attributes: ['id_role','id'],
            }],
            attributes:['token']
        })
    };

    findSessionByRefreshToken(token:string):Promise<Session|null>{
        return this.model.findOne({where:{token:token}});
    }

}
