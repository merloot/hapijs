import * as Joi from 'joi';

export const outputSchema = (ok: boolean, res: Joi.Schema): Joi.Schema => Joi.object({
    ok: ok,
    result: res,
});

export function outputPaginationSchema(title: string, item: Joi.Schema): Joi.Schema {
    return Joi.object({
        ok: Joi.boolean().example(true),
        result: Joi.object({
            count: Joi.number().integer().example(10),
            [title]: Joi.array().items(item),
        }),
    });
}

export function validateUser(user){
    const userSchema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
    });
    return userSchema.validate(user)
}

export const  userSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .required().options({}),
});


