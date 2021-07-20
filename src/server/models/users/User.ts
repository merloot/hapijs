import {
    Column, DataType, Model, Scopes, Table, HasOne, IsEmail,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { getUUID, } from '../../utils/index';

// @Scopes(() => ({
//   defaultScope: {
//     attributes: {
//       exclude: ['password'],
//     },
//   },
//   withPassword: {
//     attributes: {
//       include: ['password'],
//     },
//   },
// }))
@Table
export class User extends Model {
  @Column({ primaryKey: true, type: DataType.STRING, defaultValue: () => getUUID(), }) id: string;

  @IsEmail
  @Column({
      type: DataType.STRING,
      unique: true,
  })email: string;


  @Column({
    type: DataType.STRING,
    set(value: string) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(value, salt);
      // @ts-ignore
      this.setDataValue('password', hash);
    },
    get() {
      // @ts-ignore
      return this.getDataValue('password');
    },
  })
  password: string;

  async passwordCompare(pwd: string) {
    return bcrypt.compareSync(pwd, this.password);
  }
}

export interface IUser{
  email: string;
  password: string;
}
