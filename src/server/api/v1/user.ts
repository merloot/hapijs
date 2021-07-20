import { getPagination, getPagingData, output } from '../../utils';
import {User} from "../../models/users/User";
import { getUsersDto, userLoginDto, userRegistryDto} from "../../models/users/dto/user.registry.dto";
import sequelize from "../../models";
import {validateUser} from "../../schemes";
import * as bcrypt from 'bcrypt';
import {generateJwt} from "../../utils/auth";


const userRepository = sequelize.getRepository(User);


export async function registration (request): Promise<User | any>{

    const userData: userRegistryDto = request.payload;
    const {error: validationError} = validateUser(userData);
    if (validationError){
        return output({error:validationError.details[0].message});
    }
    await userRepository.findOne({where:{email:userData.email}}).then(async function (user) {
        if (user){
            return output({error:'Email already registered.'});
        }else {
            const user = await userRepository.create({...userData});
            return output(user);
        }
    });

}

export async function login(request): Promise<JsonWebKey | any> {
    const userData: userLoginDto = request.payload;
    const {error: validationError} = validateUser(userData);
    if (validationError){
        return output({error:validationError.details[0].message});
    }
     await userRepository.findOne({where:{email:userData.email}}).then(async function (user){
        if (!user){
            return output({error:'User not exists'})
        }else if (await bcrypt.compareSync(userData.password, user.get('password'))){
            //TODO Разобраться почему не генериться jwt token
            const token = generateJwt(user);
            console.log(token);
        }else {
            return output({error:"password is not valid"})
        }
     });
}

export async function getUsers(request){
    const userData: getUsersDto = request.payload;

    const {limit, offset} = getPagination(userData.page, userData.pageSize);
    const users = await userRepository.findAndCountAll({
        limit: userData.pageSize,
        offset: userData.page
    }).then(data => {
        const response = getPagingData(data, userData.page, userData.pageSize);
        return ;
    });
}
