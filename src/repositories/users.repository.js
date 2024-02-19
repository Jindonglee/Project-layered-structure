export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getUserByEmail = async (email) => {
    const user = await this.prisma.users.findFirst({
      where: { email },
    });
    return user;
  };

  createUser = async (name, email, password, grade) => {
    const newUser = await this.prisma.users.create({
      data: {
        name,
        email,
        password,
        grade,
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
    const userInfo = await this.prisma.users.findFirst({
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
