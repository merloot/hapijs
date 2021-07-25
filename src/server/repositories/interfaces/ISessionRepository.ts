export interface ISessionRepository<T>  {

    findUserById(id:string):Promise<T>;

    findSessionByRefreshToken(token:string):Promise<T>;

}
