export class userRegistryDto{
    readonly email:string;
    readonly password:string;
}

export class userLoginDto{
    readonly email:string;
    readonly password:string;
}

export class getUsersDto{
    readonly page:number;
    readonly pageSize:number;
}