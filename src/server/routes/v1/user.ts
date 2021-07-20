import {getUsers, login, registration,} from '../../api/v1/user';
import {outputOkSchema, outputPaginationSchema,} from "../../schemes";
export default
[
    {
      method: 'POST',
        path: '/v1/user/registration',
        handler: registration,
        options: {
        id: 'v1.user.registration.post',
            tags: ['api', 'v1', 'user'],
            auth: false,
            response:{
          schema: outputOkSchema
            },
        },
    },
    {
      method: 'POST',
        path: '/v1/user/login',
        handler: login,
        options: {
        id: 'v1.user.login.post',
            tags: ['api', 'v1', 'user'],
            auth: false,
            response:{
          schema: outputOkSchema
            },
        },
    },
    {
        method: 'GET',
        path: '/v1/users',
        handler: getUsers,
        options:{
            id: 'v1.users',
            tags: ['api','v1','user'],
            response:{
                schema: outputPaginationSchema
            },
        },
    },
];
