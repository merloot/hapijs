import { v4 as uuidv4, } from 'uuid';
import { Boom, } from '@hapi/boom';
import * as FileType from 'file-type';
import * as speakeasy from 'speakeasy';
import config from '../config/config';
import sequelize from "../models";
import {UniqueConstraintError} from 'sequelize'

interface IFileWithExt {
  data: Buffer;
  fileExt: string;
}

export function getUUID(): string {
  return uuidv4();
}

export function getRealIp(request): string {
  return request.headers['cf-connecting-ip']
    ? request.headers['cf-connecting-ip']
    : request.info.remoteAddress;
}

export function output(res?: object | null): object {
  return {
    ok: true,
    result: res,
  };
}



export function error(code: number, msg: string, data: object): Boom {
  return new Boom(msg, {
    data: {
      code,
      data,
      api: true,
    },
    statusCode: Math.floor(code / 1000),
  });
}

export function totpValidate(totp: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: Number(totp),
  });
}

export function responseHandler(r, h) {
    let response = r.response;
    // isServer indicates status code >= 500
    //  if error, pass it through server.log
    if (response && response.isBoom && response.isServer) {
      console.log(response)
        const error = response.error || response.message;
        console.log([ 'error' ], error);
    }
    return h.continue
}

export async function handleValidationError(r, h, err) {
  return error(
    400000,
    'Validation error',
      err.details.map((e) => ({ field: e.context.key, reason: e.type.replace('any.', ''), }))
  );
}

export const getFileExt = async (file: Buffer): Promise<IFileWithExt> => {
  if (!Buffer.isBuffer(file)) {
    throw error(400000, 'This file type is now allowed', null);
  }

  const fileExt = await FileType.fromBuffer(file);
  if (!fileExt || !fileExt.ext.match(config.files.allowedExtensions)) {
    throw error(400000, 'This file type is now allowed', null);
  }

  return { data: file, fileExt: fileExt.ext, };
};
