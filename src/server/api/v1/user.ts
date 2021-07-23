import {error, output} from '../../utils';
import {User} from "../../models/users/User";
import {userGetDto, userLoginDto, userRegistryDto} from "../../models/users/dto/user.dto";
import sequelize from "../../models";
import {createJWToken, generateJwt} from "../../utils/auth";
import {exist} from "joi";

const userRepository = sequelize.getRepository(User);


export async function registration(request) {
    try {
        const  userData: userRegistryDto = request.payload;
        let user = await userRepository.findOne({where:{email:userData.email}, attributes:['email']});
        if (user){
            return error(400, 'email is exists',null)
        }else {

            return output(await userRepository.create({...userData}));
        }
    }catch (err){
        return error(400, err, null);
    }
}

export async function login(request) {
    try {
        let userData: userLoginDto = request.payload;
        console.log();
        let user = await userRepository.findOne({where:{email:userData.email}, attributes:['id','email','password']});
        if (user){
            return await user.passwordCompare(userData.password) ?
                output(generateJwt({id:user.id, id_role: '23'})) :
                error(400, 'password is not valid', user)
        }
    }catch (err){
        return error(400, err,null)
    }
}

export function getUsers(request) {
    console.log(request);
    let userData: userGetDto = request.payload;
    return userRepository.findAndCountAll({limit: userData.limit, offset:userData.offset})
        .then((users) => output(users))
        .catch(err => output(err))
}
