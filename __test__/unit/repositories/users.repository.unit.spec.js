import { jest } from "@jest/globals";
import { UsersRepository } from "../../../src/repositories/users.repository";

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  users: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

let usersRepository = new UsersRepository(mockPrisma);

describe("Users Repository Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("getUserByEmail method", async () => {
    // 가짜 사용자 데이터
    const email = "test@example.com";
    const User = {
      userId: "1",
      name: "Test User",
      email,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    usersRepository.prisma.users.findFirst.mockResolvedValue(User);

    const result = await usersRepository.getUserByEmail(email);

    expect(result).toEqual(User);

    expect(usersRepository.prisma.users.findFirst).toHaveBeenCalledTimes(1);
    expect(usersRepository.prisma.users.findFirst).toHaveBeenCalledWith({
      where: { email },
    });
  });

  test("createUser method", async () => {
    // 새로운 사용자 정보
    const name = "New User";
    const email = "newuser@example.com";
    const password = "password123";
    const grade = "user";

    // 새로운 사용자가 생성될 때 반환될 가짜 사용자 데이터
    const newUser = {
      userId: "2",
      name,
      email,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    usersRepository.prisma.users.create.mockResolvedValue(newUser);

    const result = await usersRepository.createUser(
      name,
      email,
      password,
      grade
    );

    expect(result).toEqual(newUser);

    expect(usersRepository.prisma.users.create).toHaveBeenCalledTimes(1);
    expect(usersRepository.prisma.users.create).toHaveBeenCalledWith({
      data: { name, email, password, grade },
      select: {
        userId: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  test("getUserById method", async () => {
    const user = {
      userId: "1",
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    usersRepository.prisma.users.findFirst.mockResolvedValue(user);

    const result = await usersRepository.getUserById(user);
    expect(result).toEqual(user);

    expect(usersRepository.prisma.users.findFirst).toHaveBeenCalledTimes(1);
    expect(usersRepository.prisma.users.findFirst).toHaveBeenCalledWith({
      where: { userId: user.userId },
      select: {
        userId: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });
});
