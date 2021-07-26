export interface IUserRepository<T>{

    findUserByEmail(email:string): Promise<T | null>;

    getUsers(limit?:number,offset?:number):Promise<T| null>;
}
