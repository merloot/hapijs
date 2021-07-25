import {User} from "./User";
import {getUUID} from "../../utils";
import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';

@Table
export class Role extends Model {
    @Column({
        primaryKey: true,
        type: DataType.STRING,
        defaultValue: () => getUUID(),
    }) id: string;


    @HasMany(() => User)
    users: User[];

    @Column({
        type: DataType.STRING,
        unique: true,
    })role: string;
}

