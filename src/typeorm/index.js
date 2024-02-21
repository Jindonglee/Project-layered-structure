import typeorm from "typeorm";
import usersEntity from "./entity/users.entity.js";
import postsEntity from "./entity/posts.entity.js";
import dotenv from "dotenv";

dotenv.config();

const dataSource = new typeorm.DataSource({
  type: "mysql",
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.NAME,
  password: process.env.PASSWORD,
  database: process.env.DB,
  synchronize: false,
  entities: [usersEntity, postsEntity],
});

export default dataSource;
