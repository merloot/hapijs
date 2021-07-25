import {IBaseRepository} from "./interfaces/IBaseRepository";

export abstract class baseRepository <T> implements IBaseRepository<T>{

    protected model;

    public constructor(model){
        this.model = model;
    }


    public getClassName(){
        return this.model.name;
    }

    async create(item): Promise<any> {
       return this.model.create({...item});
    }

    update(attributes, condition): Promise<boolean> {
        return this.model.update({...attributes},condition)
    }

    exists(condition: T): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    delete(condition: T): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    findOne(condition: string): Promise<T> {
        throw new Error('Method not implemented.');
    }
    find(id: string): Promise<T[]> {
        throw new Error('Method not implemented.');
    }


}
