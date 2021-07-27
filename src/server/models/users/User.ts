import {Role} from "./Roles";
import {date, string} from "joi";
import * as bcrypt from 'bcrypt';
import { getUUID, } from '../../utils';
import { Column, DataType, Model, Table, IsEmail, ForeignKey, BelongsTo } from 'sequelize-typescript';
import {RoleRepository} from "../../utils/repositories";

@Table
export class User extends Model {

  @Column({
      primaryKey: true,
      type: DataType.STRING,
      defaultValue: () => getUUID(),
  })id: string;

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

  @ForeignKey(() => Role)

  // async defaultRole (){
  //     return await RoleRepository.findIdForBuyerRole();
  // }

  @Column({
      type: DataType.STRING,
      // defaultValue: async () => {
      //     await RoleRepository.findIdForBuyerRole();
      // },
  })id_role: string;

  @BelongsTo(() => Role)
  role: Role;

    async passwordCompare(pwd: string) {
        return bcrypt.compareSync(pwd, this.password);
    }
}

//TODO потом подумать куда лучше добавить
// Role.bulkCreate([
//     {role:'banned'},
//     {role:'buyer'},
//     {role:'develop_project'},
//     {role:'admin'},
//     {role:'super_admin'},
// ], {validate: true}).catch((err) => console.log(err));
