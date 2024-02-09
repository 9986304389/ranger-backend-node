
module.exports ={
    type: 'postgres',
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    type: "postgres",
    entities: ["entities/*.js"],
    keepConnectionAlive: true, 
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
    cli: {
      "entitiesDir": "entities"
    }
  }
  