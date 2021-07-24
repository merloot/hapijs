import { errors, getRealIp, getUserAgent, output, outputPagination} from '../../utils';
import {User} from "../../models/users/User";
import {Session} from "../../models/users/Session";
import {userGetDto, userLoginDto, userRegistryDto} from "../../models/users/dto/user.dto";
import sequelize from "../../models";
import { destroyJwt, generateJwt} from "../../utils/auth";
import {exist} from "joi";
import config from "../../config/config";


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
    let token = request.payload.refresh;
    let type = 'refresh';

    request.headers['authorization']= 'Bearer ' + token.refresh;
    console.log(request);
    // let data = await decodeJwt(token, config.auth.jwt.refresh.secret);
    let sessionRepository = sequelize.getRepository(Session);
    console.log(1);
    let user = await sessionRepository.findOne({where:{token: token}});
    if (user){
        await destroyJwt(request.payload.refresh, config.auth.jwt.refresh.secret);
        let token = generateJwt({id:user.id});
        await setSession(request,user.id, token.refresh);
        return output(token);
    }
    return errors(400, 'user not found')
}

// export async function refresh(request){
//     try {

        // console.log(await refreshToken(token,type));
        // return output(await refreshToken(token,type));
        // return jwt.sign(data, config.auth.jwt.access.secret, { algorithm:'HS256', expiresIn: config.auth.jwt.access.lifetime, });
    // }catch (err){
    //     return errors(400, err)
    // }
// }

async function setSession(request, user_id:string,  token:string){
    try {
        let sessionData = {
          token: token,
          user_id: user_id,
          ip:getRealIp(request),
          user_agent: getUserAgent(request)};

        let sessionRepository = sequelize.getRepository(Session);

        let session = await sessionRepository.findOne({where:{user_id:sessionData.user_id}});
        if (session){
            await sessionRepository.update({...sessionData},{where:{user_id:sessionData.user_id}})
        }else {
            await sessionRepository.create({...sessionData})
        }

    } catch (err){
        return err;
    }
}

export async function getUsers(request){
    try {
        console.log(request);
        let userData: userGetDto = request.query;
        let users = await userRepository.findAndCountAll({limit: userData.limit, offset:userData.offset});
        console.log(users);

        return outputPagination('users',users.count,users.rows);

    }catch (err){
        return errors(400, err)
    }
    // return userRepository.findAndCountAll({limit: userData.limit, offset:userData.offset})
    //     .then((users) => output(users))
    //     .catch(err => output(err))
}
