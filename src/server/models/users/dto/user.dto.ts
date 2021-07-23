export class userRegistryDto{
    readonly email:string;
    readonly password:string;
}

export class userLoginDto{
    readonly email:string;
    readonly password:string;
}

export class userGetDto{
    readonly limit:number;
    readonly offset: number;
}