import dataSource from "../typeorm/index.js";
dataSource.initialize();

export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getUserByEmail = async (email) => {
    const user = await dataSource.getRepository("Users").findOne({
      where: { email },
    });
    return user;
  };

  createUser = async (name, email, password, grade) => {
    await dataSource.getRepository("Users").insert({
      name,
      email,
      password,
      grade,
      updatedAt: new Date(),
    });
    const newUser = await dataSource.getRepository("Users").findOne({
      where: {
        email,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return newUser;
  };

  getUserById = async (user) => {
    const { userId } = user;

    const userInfo = await dataSource.getRepository("Users").findOne({
      where: { userId },
      select: {
        userId: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return userInfo;
  };
}
