import {getUsers, login, registration,} from '../../api/v1/user';
import {outputSchema, outputPaginationSchema, userSchema, validateUser,} from "../../schemes";
export default [
    {
        method: 'POST',
        path: '/v1/user/registration',
        options: {
            id: 'v1.user.registration.post',
            tags: ['api', 'v1', 'user'],
            handler: registration,
            auth: false,
            validate:{ payload: validateUser},
            response:{ schema: outputSchema },
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
                schema: outputSchema
            },
            validate:{
                payload: validateUser,
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
