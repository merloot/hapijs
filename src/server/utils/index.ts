import { v4 as uuidv4, } from 'uuid';
import { Boom, } from '@hapi/boom';
import * as FileType from 'file-type';
import * as speakeasy from 'speakeasy';
import config from '../config/config';

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

export function output(ok:boolean,res?: object | null): object {
  return {
    ok: ok,
    result: res,
  };
}
export  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: tutorials } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, tutorials, totalPages, currentPage };
};

export const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};


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
  // Handle default hapi errors (like not found, etc.)
  if (r.response.isBoom && r.response.data === null) {
      r.response = h.response({
          ok: false,
          code: Math.floor(r.response.output.payload.statusCode * 1000),
          data: {},
          msg: r.response.output.payload.message,
      })
      .code(r.response.output.statusCode);
      // console.log(1,r.response.request.payload.error.details[0].message);

      return h.continue;
  }

  // Handle custom api error
  if (r.response.isBoom && r.response.data.api) {
      r.response = h.response({
          ok: false,
          code: r.response.data.code,
          msg: r.response.output.payload.message,
          data: r.response.data.data,
      }).code(Math.floor(r.response.data.code / 1000));
      // console.log(2,r.response);
    return h.continue;
  }

  // Handle non api errors with data
  if (r.response.isBoom && !r.response.data.api) {
      r.response = h
      .response({
        ok: false,
        code: Math.floor(r.response.output.statusCode * 1000),
        data: r.response.data,
        msg: r.response.message,
      })
      .code(r.response.output.statusCode);
      // console.log(3,r.response);

      return h.continue;
  }
    return h.continue;
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
