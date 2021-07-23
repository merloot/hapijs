import { getPagination, getPagingData, output } from '../../utils';
import {User} from "../../models/users/User";
import { getUsersDto, userLoginDto, userRegistryDto} from "../../models/users/dto/user.registry.dto";
import sequelize from "../../models";
import * as bcrypt from 'bcrypt';
import {generateJwt} from "../../utils/auth";
import {userSchema} from "../../schemes";


const userRepository = sequelize.getRepository(User);


export async function registration (request) {
    if (request.payload.error){
        return output(false,request.payload.error.details[0].message)
    }
    const userData: userRegistryDto = request.payload;
    console.log(request.payload);
    await userRepository.findOne({where:{email:userData.email}}).then(async function (user) {
        if (user) {
            return output(false, {error:'Email already registered.'});
        } else {
            const user = await userRepository.create({...userData});
            return output(true, user);
        }
    });
}

export async function login(request): Promise<JsonWebKey | any> {
    const userData: userLoginDto = request.payload;
    await userRepository.findOne({where:{email:userData.email}}).then(async function (user){
        if (!user){
            return output(false, {error:'User not exists'})
        } else if (await bcrypt.compareSync(userData.password, user.get('password'))){
            //TODO Разобраться почему не генериться jwt token
            const token = generateJwt(user);
            return output(true,token)
            // console.log(token);
        } else {
            return output(false,{error:"password is not valid"})
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
