import typeorm from "typeorm";

const EntitySchema = typeorm.EntitySchema;

export default new EntitySchema({
  name: "Resume", // Will use table name `category` as default behaviour.
  tableName: "resume", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    resumeId: {
      primary: true,
      type: "int",
      generated: true,
    },
    userId: {
      type: "int",
    },
    title: {
      type: "varchar",
    },
    content: {
      type: "varchar",
    },
    status: {
      type: "varchar",
    },
    createdAt: {
      type: "datetime",
    },
    updatedAt: {
      type: "datetime",
    },
  },
  relations: {
    users: {
      target: "Users",
      type: "many-to-one",
      joinTable: true,
      joinColumn: { name: "userId" },
      cascade: true,
    },
  },
});
