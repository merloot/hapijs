import {exist} from "joi";
import config from "../../config/config";
import { destroyJwt, generateJwt} from "../../utils/auth";
import {sessionRepository, userRepository} from "../../utils/repositories";
import { errors, getRealIp, getUserAgent, output, outputPagination} from '../../utils';
import {userGetDto, userLoginDto, userRegistryDto} from "../../models/users/dto/user.dto";



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
        let user = await userRepository.findOne({where:{email:userData.email}, attributes:['id','email','password']});
        if (user){
            if (await user.passwordCompare(userData.password)) {
                let token = generateJwt({id:user.id});
                await setSession(request,user.id, token.refresh);
                return output(token);
            }
            return errors(400, 'password invalid')
        }
    }catch (err){
        return errors(400, err)
    }
}


export async function getUsers(request){
    try {
        let userData: userGetDto = request.query;
        let users = await userRepository.findAndCountAll({limit: userData.limit, offset:userData.offset});
        return outputPagination('users',users.count,users.rows);

    }catch (err){
        return errors(400, err)
    }
}

export async function logout(request){
    try {
        let token = request.auth.artifacts.token;
        let type = request.auth.artifacts.type;
        return destroyJwt(token,config.auth.jwt[type].secret )
    }catch (err){
        return errors(400, err)
    }
}

export async function refresh(request){
    let refresh = request.auth.artifacts.token;
    let user = await sessionRepository.findOne({where:{token: refresh}});
    if (user){
        let token = await generateJwt({id:user.user_id});
        await setSession(request,user.user_id, token.refresh);
        return output(token);
    }
    return errors(400, 'user not found')
}


async function setSession(request, user_id:string,  token:string){
    try {
        let sessionData = {
          token: token,
          user_id: user_id,
          ip:getRealIp(request),
          user_agent: getUserAgent(request)};

        let session = await sessionRepository.findOne({where:{user_id:sessionData.user_id}});
        if (session){
            await sessionRepository.update({...sessionData},{where:{user_id:sessionData.user_id}})
        }else {
            await sessionRepository.create({...sessionData})
        }

    } catch (err){
        return errors(400,err);
    }
}

