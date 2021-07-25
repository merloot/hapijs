import { error, } from './index';
import { Errors, } from './errors';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import {sessionRepository, userRepository} from "./repositories";

export const generateJwt = (data: object) => {
  const access = jwt.sign(data, config.auth.jwt.access.secret, { algorithm:'HS256', expiresIn: config.auth.jwt.access.lifetime, });
  const refresh = jwt.sign(data, config.auth.jwt.refresh.secret, { algorithm:'HS256', expiresIn: config.auth.jwt.refresh.lifetime, });

  return { access, refresh, };
};

export const decodeJwt = async (token: string, secret: string) => {
  try {
    return await jwt.verify(token, secret);
  }
  catch (e) {
    const code = e.name === 'TokenExpiredError' ? Errors.TokenExpired : Errors.TokenInvalid;
    const msg = e.name === 'TokenExpiredError' ? 'Token expired' : 'Token invalid';
    throw error(code, msg, {});
  }
};

export const destroyJwt = async (token: string, secret: string) => {
    try {
        return await jwt.destroy(token, secret);
    }
    catch (e) {
        const code = e.name === 'TokenExpiredError' ? Errors.TokenExpired : Errors.TokenInvalid;
        const msg = e.name === 'TokenExpiredError' ? 'Token expired' : 'Token invalid';
        throw error(code, msg, {});
    }
};

export type validateFunc = (r, token: string) => Promise<any>;

// Fabric which returns token validate function depending on token type
export function tokenValidate(tokenType: 'access' | 'refresh'): validateFunc {
  return async function (r, token: string) {
    let data = await decodeJwt(token, config.auth.jwt[tokenType].secret);
      const user = await sessionRepository.findOne({where:{user_id: data.id},include:[userRepository]});
      if (user) {
          return { isValid: true, credentials: user, artifacts: { token, type: tokenType, }, };
      }

      throw error(Errors.SessionNotFound, 'User not found', {});
  };
}
