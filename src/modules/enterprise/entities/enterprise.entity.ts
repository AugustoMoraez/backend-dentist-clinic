import { IsOptional, IsString } from "class-validator";
import {  Column, DataType, Default,  IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { v4 } from "uuid";




@Table
export class Address extends Model<Address> {
    @PrimaryKey
    @IsUUID(4)
    @Default(()=>v4())
    @Column(DataType.UUIDV4 )
    address_id:string;

    @IsString()
    @Column(DataType.STRING)
    number:string;

    @IsString()
    @Column(DataType.STRING)
    street:string;

    @IsString()
    @Column(DataType.STRING)
    district:string;

    @IsString()
    @Column(DataType.STRING)
    state:string;

    @IsOptional()
    @IsString()
    @Column(DataType.STRING)
    complement:string;
}
 

@Table
export class Enterprise extends Model<Enterprise> {
  @PrimaryKey
  @Column(DataType.UUID)
  enterprise_id;

  @Column(DataType.STRING)
  email;

  @Column(DataType.STRING)
  password;

  @Column(DataType.STRING)
  razao;

  @Column(DataType.STRING)
  fantasy_name;

  @Column(DataType.STRING)
  cnpj;

  @Column(DataType.STRING)
  cpf;

  @Column(DataType.STRING)
  contact_1;

  @Column(DataType.STRING)
  contact_2;

 
}
