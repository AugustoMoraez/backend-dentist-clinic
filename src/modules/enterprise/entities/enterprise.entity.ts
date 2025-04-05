

export class Address {
    number:string;
    street:string;
    district:string;
    state:string;
    complement:string;
}

//Employee = Funcionario
export class Employee{

}
//Patient = paciente
export class Patient {paciente

}


export class Enterprise {
    id:string;
    email:string;
    password:string
    
    razao:string;
    fantasy_name:string;
    cnpj:string;
    cpf:string;
    contact_1:string;
    contact_2:string;
    address:Address;

    patient:Patient[];
    employee:Employee[]

}
