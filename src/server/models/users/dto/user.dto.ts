
export class userRegistryDto{
    readonly email:string;
    readonly password:string;
    readonly id_role:string;
}

export class userLoginDto{
    readonly email:string;
    readonly password:string;
}

export class userGetDto{
    readonly limit:number;
    readonly offset: number;
}

export class userUpdateRoleDto{
    readonly email:string;
    readonly id_role: string;
}
