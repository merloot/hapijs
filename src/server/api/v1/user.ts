import {errors, output} from '../../utils';
import {User} from "../../models/users/User";
import {userGetDto, userLoginDto, userRegistryDto} from "../../models/users/dto/user.dto";
import sequelize from "../../models";
import { generateJwt} from "../../utils/auth";
import {exist} from "joi";

const userRepository = sequelize.getRepository(User);


export async function registration(request) {
    try {
        const  userData: userRegistryDto = request.payload;
        let user = await userRepository.findOne({where:{email:userData.email}, attributes:['email']});
        if (user){
            return errors(400, 'email already exists',user)
        }else {

            return output(await userRepository.create({...userData}));
        }
    }catch (err){
        return errors(400, err, null);
    }
}

export async function login(request) {
    try {
        let userData: userLoginDto = request.payload;
        console.log();
        let user = await userRepository.findOne({where:{email:userData.email}, attributes:['id','email','password']});
        if (user){
            return await user.passwordCompare(userData.password) ?
                output(generateJwt({id:user.id})) :
                errors(400, 'password is invalid');
        }
    }catch (err){
        return errors(400, err)
    }
}

export async function getUsers(request){
    try {
        console.log(request);
        let userData: userGetDto = request.query;
        return await console.log(userRepository.findAndCountAll({limit: userData.limit, offset:userData.offset}));

    }catch (err){
        return errors(400, err)
    }
    // return userRepository.findAndCountAll({limit: userData.limit, offset:userData.offset})
    //     .then((users) => output(users))
    //     .catch(err => output(err))
}
