import * as Qs from 'qs';
import routes from './routes';
import * as Nes from '@hapi/nes';
import * as Pino from 'hapi-pino';
import * as Hapi from '@hapi/hapi';
import * as Inert from '@hapi/inert';
import config from './config/config';
import * as Basic from '@hapi/basic';
import * as Vision from '@hapi/vision';
import * as HapiCors from 'hapi-cors';
import * as HapiPulse from 'hapi-pulse';
import { pinoConfig, } from './config/pino';
import { tokenValidate,} from './utils/auth';
import SwaggerOptions from './config/swagger';
import * as HapiBearer from 'hapi-auth-bearer-token';
import { responseHandler } from './utils';


const HapiSwagger = require('hapi-swagger');
const Package = require('../../package.json');

SwaggerOptions.info.version = Package.version;

const init = async () => {
  const server = await new Hapi.Server({
    port: config.server.port,
    host: config.server.host,
    query: {
      parser: (query) => Qs.parse(query),
    },
    routes: {
      validate: {
        options: {
          // Handle all validation errors
          abortEarly: false,
        },
        failAction:  async (request, h, err) => {
          let er = err.details.map((e)=>(e.message));
            console.log(err.details.map((e)=>(e.message)));
            return h.response({code:400,message:'Validation error',er}).takeover();
        }
      },
    },
  });
  server.realm.modifiers.route.prefix = '/api';
  // Регистрируем расширения
  await server.register([
    Basic,
    Nes,
    Inert,
    Vision,
    HapiBearer,
    { plugin: Pino, options: pinoConfig(true), },
    { plugin: HapiSwagger, options: SwaggerOptions, }
  ]);

  // JWT Auth
  server.auth.strategy('jwt-access', 'bearer-access-token', {
    validate: tokenValidate('access'),
  });
  server.auth.strategy('jwt-refresh', 'bearer-access-token', {
    validate: tokenValidate('refresh'),
  });
  server.auth.default('jwt-access');

  // Загружаем маршруты
  server.route(routes);
  // Error handler
  server.ext('onPreResponse', responseHandler);
  await server.register({
    plugin: HapiPulse,
    options: {
      timeout: 15000,
      signals: ['SIGINT'],
    },
  });
  // Enable CORS (Do it last required!)
  await server.register({
    plugin: HapiCors,
    options: config.cors,
  });
  // Запускаем сервер
  try {
    await server.start();
      server.log('info', `Server running at: ${server.info.uri}`);
  }
  catch (err) {
    server.log('error', JSON.stringify(err));
  }
  return server;
};

export { init, };
