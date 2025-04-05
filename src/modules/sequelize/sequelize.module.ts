import { SequelizeModule } from "@nestjs/sequelize";
import { Address, Employee, Enterprise, Patient } from "../enterprise/entities/enterprise.entity";

export const ORM_MODULE = SequelizeModule.forRoot({
    dialect:"postgres",
    username:"Dev",
    password:"pq-0pEr7q2rLCKl90d6qIg",
    host:"battle-howler-5642.jxf.gcp-southamerica-east1.cockroachlabs.cloud",
    port:26257,
    database:"postgres",
    synchronize: true,
    ssl: true,  
  dialectOptions: {
    ssl: {
      require: true,  
      rejectUnauthorized: false, 
    },
  },
    models: [Enterprise,Address,Employee,Patient]
  })

  export const ENTITIES = SequelizeModule.forFeature(
    [Enterprise,Address,Employee,Patient]
)