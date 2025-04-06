import { IsOptional, IsString } from "class-validator";
import {  Column, DataType, Default, IsEmail, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
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
  @Default(()=>v4())
  @Column(DataType.UUIDV4)
  enterprise_id: string;

  @IsEmail
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.STRING)
  razao: string;

  @Column(DataType.STRING)
  fantasy_name: string;

  @IsOptional()
  @Column(DataType.STRING)
  cnpj: string;

  @IsOptional()
  @Column(DataType.STRING)
  cpf: string;

  @Column(DataType.STRING)
  contact_1: string;

  @IsOptional()
  @Column(DataType.STRING)
  contact_2: string;

 
}
