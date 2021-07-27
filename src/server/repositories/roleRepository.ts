import {Role} from "../models/users/Roles";
import {baseRepository} from "./baseRepository";
import {IRoleRepository} from "./interfaces/IRoleRepository";
import {User} from "../models/users/User";

export class roleRepository extends baseRepository<Role> implements IRoleRepository<Role>{

    findIdForBannedRole(): Promise<Role | null> {
        return this.model.findOne({where:{role:'banned'}});
    }

    findIdForBuyerRole(): Promise<Role | null> {
        return this.model.findOne({where:{role:'buyer'}});
    }

    findIdForDevelopProjectRole(): Promise<Role | null> {
        return this.model.findOne({where:{role:'develop_project'}});
    }

    findIdForAdminRole(): Promise<Role | null> {
        return this.model.findOne({where:{role:'admin'}});
    }

    findIdForSuperAdminRole(): Promise<Role | null> {
        return this.model.findOne({where:{role:'super_admin'}});
    }
}
