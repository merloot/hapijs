import {exist} from "joi";
import config from "../../config/config";
import { destroyJwt, generateJwt} from "../../utils/auth";
import {RoleRepository, SessionRepository, UserRepository} from "../../utils/repositories";
import { errors, getRealIp, getUserAgent, output, outputPagination} from '../../utils';
import {userRegistryDto, userGetDto, userLoginDto,} from "../../models/users/dto/user.dto";



export async function registration(request ) {
    try {
        let bueyr = await RoleRepository.findIdForBuyerRole();
        const  userData: userRegistryDto = {...request.payload, id_role:bueyr.id};
        let user = await UserRepository.findUserByEmail(userData.email);
        if (user){
            return errors(400, 'email already exists',null)
        }else {
            return output(await UserRepository.create({...userData}));
        }
    }catch (err){
        return errors(400, err, null);
    }
}

export async function login(request) {
    try {
        let userData: userLoginDto = request.payload;
        let user = await UserRepository.findUserByEmail(userData.email);
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
        let users = await UserRepository.getUsers(userData.limit,userData.offset);
        return outputPagination(UserRepository.getClassName(),users);

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
//
export async function refresh(request){
    let refresh = request.auth.artifacts.token;
    let user = await SessionRepository.findSessionByRefreshToken(refresh);
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

        let session = await SessionRepository.findUserById(sessionData.user_id);
        if (session){
            await SessionRepository.update({...sessionData},{where:{user_id:sessionData.user_id}})
        }else {
            await SessionRepository.create({...sessionData})
        }

    } catch (err){
        return errors(400,err);
    }
}

