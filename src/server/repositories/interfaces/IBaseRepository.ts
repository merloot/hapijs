
export interface IBaseRepository<T>{

    create(item): Promise<any>;

    bulkCreate(array:object):Promise<any>
    find(id:string): Promise<T[]>;

    findOne(condition:string): Promise<T>;

    update(attributes:T, condition?:T): Promise<boolean>;

    delete(condition:T): Promise<boolean>;

    exists(condition:T): Promise<boolean>;
}
