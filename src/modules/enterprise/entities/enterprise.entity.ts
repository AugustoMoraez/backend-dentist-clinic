import { IsOptional, IsString } from "class-validator";
import { BelongsTo, Column, DataType, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { v4 } from "uuid";


//Employee = Funcionario
@Table
export class Employee extends Model<Employee> {
  @PrimaryKey
  @IsUUID(4)
  @Default(() => v4())
  @Column(DataType.STRING)
  employee_id: string; // ID do empregado

  @ForeignKey(() => Enterprise)
  @Column(DataType.UUID)
  enterprise_id: string; // Chave estrangeira para Enterprise

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  role: string;

  @Column(DataType.STRING)
  contact: string;
}
//Patient = paciente
@Table
export class Patient extends Model<Patient> {
  @PrimaryKey
  @IsUUID(4)
  @Default(() => v4())
  @Column(DataType.STRING)
  patient_id: string; // ID do paciente

  @ForeignKey(() => Enterprise)
  @Column(DataType.UUID)
  enterprise_id: string; // Chave estrangeira para Enterprise

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  birth_date: string;

  @Column(DataType.STRING)
  contact: string;
}

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
    @IsUUID(4)
    @Default(()=>v4())
    @Column(DataType.UUIDV4 )
    enterprise_id:string;
    @Column(DataType.STRING )
    email:string;
    @Column(DataType.STRING )
    password:string
    @Column(DataType.STRING )
    razao:string;
    @Column(DataType.STRING )
    fantasy_name:string;
    @Column(DataType.STRING )
    cnpj:string;
    @Column(DataType.STRING )
    cpf:string;
    @Column(DataType.STRING )
    contact_1:string;
    @Column(DataType.STRING )
    contact_2:string;
    
    @ForeignKey(()=>Address)
    @Column(DataType.UUIDV4)
    address_id:string;

    @BelongsTo(()=>Address)
    address:Address;

    patient:Patient[];
    employee:Employee[]

}
