import typeorm from "typeorm";

const EntitySchema = typeorm.EntitySchema;

export default new EntitySchema({
  name: "Users", // Will use table name `category` as default behaviour.
  tableName: "users", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    userId: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    kakaoId: {
      type: "int",
      nullable: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
    createdAt: {
      type: "datetime",
    },
    updatedAt: {
      type: "datetime",
    },
    grade: {
      type: "varchar",
      default: "user",
    },
  },
});
