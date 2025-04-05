import { SequelizeModule } from "@nestjs/sequelize";
import { Enterprise } from "../enterprise/entities/enterprise.entity";

export const ORM_MODULE = SequelizeModule.forRoot({
    dialect:"postgres",
    username:"Dev",
    password:"pq-0pEr7q2rLCKl90d6qIg",
    host:"postgresql://Dev:pq-0pEr7q2rLCKl90d6qIg@battle-howler-5642.jxf.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
    port:26257,
    database:"postgres",
    synchronize: true
  })

  export const ENTITIES = SequelizeModule.forFeature([Enterprise])