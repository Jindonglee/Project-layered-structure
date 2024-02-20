import { expect, jest } from "@jest/globals";
import { UsersService } from "../../../src/services/users.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let mockUsersRepository = {
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
};

const usersService = new UsersService(mockUsersRepository);

describe("Posts Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("createUser Method", async () => {
    const userData = [
      {
        name: "이름입니다.",
        email: "archepro84@gmail.com",
        password: "password123",
        passwordConfirm: "password123",
        grade: "user",
      },
    ];
    const hashedPassword = await bcrypt.hash("password123", 10);
    bcrypt.hash = jest.fn().mockImplementation((password, salt) => {
      return Promise.resolve(hashedPassword);
    });

    mockUsersRepository.getUserByEmail.mockResolvedValue(null);
    const createdUser = {
      userId: "123",
      name: userData.name,
      email: userData.email,
      grade: userData.grade,
    };

    await usersService.createUser(userData);
    expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(
      userData.name,
      userData.email,
      hashedPassword,
      userData.grade
    );

    expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(
      userData.email
    );
    expect(createdUser).toEqual({
      userId: "123",
      name: userData.name,
      email: userData.email,
      grade: userData.grade,
    });
  });

  test("createUser Method with Password Mismatch", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      passwordConfirm: "differentPassword",
      grade: "user",
    };

    try {
      await usersService.createUser(userData);
    } catch (err) {
      expect(err.message).toEqual("비밀번호 확인과 일치해야 합니다.");
    }
  });

  test("createUser Method with Duplicate Email", async () => {
    // 중복된 이메일을 가진 사용자가 이미 존재하는 경우를 테스트
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      passwordConfirm: "password123",
      grade: "user",
    };

    mockUsersRepository.getUserByEmail.mockResolvedValue({});

    try {
      await usersService.createUser(userData);
    } catch (err) {
      expect(err.message).toEqual("이미 중복된 이메일이 존재합니다.");
    }
  });
  /** authenticateUser 테스트  */
  test("authenticateUser Method by Success", async () => {
    const sampleUser = {
      userId: "12345",
      email: "test@example.com",
      password: "hashedPassword",
    };
    const accessToken = "mockAccessToken";
    const refreshToken = "mockRefreshToken";
    const accessSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET_KEY;

    mockUsersRepository.getUserByEmail.mockReturnValue(sampleUser);

    const bcryptCompare = jest.fn().mockResolvedValue(true);
    bcrypt.compare = jest.fn().mockImplementation(bcryptCompare);

    const jwtSign = jest
      .fn()
      .mockReturnValueOnce("mockAccessToken")
      .mockReturnValueOnce("mockRefreshToken");

    jwt.sign = jwtSign;

    const tokens = await usersService.authenticateUser(
      sampleUser.email,
      sampleUser.password,
      "127.0.0.1",
      "jest-test"
    );

    expect(tokens.accessToken).toEqual(accessToken);
    expect(tokens.refreshToken).toEqual(refreshToken);

    expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(
      sampleUser.email
    );
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: sampleUser.userId },
      accessSecret,
      {
        expiresIn: "12h",
      }
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: sampleUser.userId },
      refreshSecret,
      {
        expiresIn: "7d",
      }
    );

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "hashedPassword",
      sampleUser.password
    );
  });

  test("authenticateUser Method with Duplicate Email", async () => {
    // 중복된 이메일을 가진 사용자가 이미 존재하는 경우를 테스트
    const sampleUser = {
      userId: "12345",
      email: "example@example.com",
      password: "hashedPassword",
    };

    mockUsersRepository.getUserByEmail.mockReturnValue({});
    const bcryptCompare = jest.fn().mockResolvedValue(true);
    bcrypt.compare = jest.fn().mockImplementation(bcryptCompare);

    try {
      await usersService.authenticateUser(
        sampleUser.email,
        sampleUser.password,
        "127.0.0.1",
        "jest-test"
      );
    } catch (err) {
      expect(err.message).toEqual("이미 중복된 이메일이 존재합니다.");
    }
  });

  test("authenticateUser Method by password Failure", async () => {
    const sampleUser = {
      userId: "12345",
      email: "example@example.com",
      password: "hashedPassword",
    };

    mockUsersRepository.getUserByEmail.mockReturnValue(sampleUser);
    const bcryptCompare = jest.fn().mockResolvedValue(false);
    bcrypt.compare = jest.fn().mockImplementation(bcryptCompare);

    await expect(
      usersService.authenticateUser(
        sampleUser.email,
        "wrongPassword",
        "127.0.0.1",
        "jest-test"
      )
    ).rejects.toThrow("비밀번호가 일치하지 않습니다.");

    expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(
      sampleUser.email
    );

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrongPassword",
      sampleUser.password
    );
  });
  test("getUser Method with Existing User", async () => {
    // 존재하는 사용자의 정보
    const User = {
      userId: "12345",
      name: "이름입니다",
      email: "example@example.com",
      grade: "user",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    mockUsersRepository.getUserById.mockResolvedValue(User);

    const userInfo = await usersService.getUser(User);

    expect(userInfo).toEqual(User);

    expect(mockUsersRepository.getUserById).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.getUserById).toHaveBeenCalledWith(User);
  });

  test("getUser Method with Non-Existing User", async () => {
    const User = {
      userId: "12345",
      name: "이름입니다.",
      email: "example@example.com",
      grade: "user",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    mockUsersRepository.getUserById.mockResolvedValue(null);

    await expect(usersService.getUser(User)).rejects.toThrow(
      "유저정보가 존재하지 않습니다."
    );

    expect(mockUsersRepository.getUserById).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.getUserById).toHaveBeenCalledWith(User);
  });
});
