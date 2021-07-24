import {getUsers, login, logout, refresh, registration,} from '../../api/v1/user';
import {getUsersSchema, outputPaginationSchema, outputSchema, userSchema,} from "../../schemes";
export default [
    {
        method: 'POST',
        path: '/v1/user/registration',
        options: {
            id: 'v1.user.registration.post',
            tags: ['api', 'v1', 'user'],
            handler: registration,
            auth: false,
            validate:{ payload: userSchema},
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
            validate:{ payload: userSchema },
        },
    },
    {
        method: 'GET',
        path: '/v1/users',
        handler: getUsers,
        options: {
            id: 'v1.users.get',
            tags: ['api', 'v1', 'user'],
            response:{ schema: outputPaginationSchema },
            validate:{ query: getUsersSchema }
        },
    },
    {
        method: 'GET',
        path: '/v1/user/logout',
        handler: logout,
        options: {
            id: 'v1.user.logout.post',
            tags: ['api', 'v1', 'user'],
            response:{
                schema: outputSchema
            },
        },
    },
    {
        method: 'POST',
        path: '/v1/user/refresh',
        handler: refresh,
        options: {
            id: 'v1.user.refresh.post',
            tags: ['api', 'v1', 'user'],
            response:{
                schema: outputSchema
            },
        },
    },
];
