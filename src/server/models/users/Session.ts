import {
    BelongsTo, Column, DataType, ForeignKey, IsUUID, Length, Model, Table,
} from 'sequelize-typescript';
import { getUUID, } from '../../utils';
import { User, } from './User';

@Table
export class Session extends Model {

    @Column({
        primaryKey: true,
        type: DataType.STRING,
        defaultValue: () => getUUID(),
    }) id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
        onDelete: "CASCADE"
    }) user_id: string;

    @Column({
        type: DataType.STRING,
    }) token: string;

    @Column({
        type: DataType.STRING,
    })user_agent: string;

  @Length({max:15})
  @Column({
      type: DataType.STRING()
  })ip: string;

  @BelongsTo(() => User) user: User;
}
