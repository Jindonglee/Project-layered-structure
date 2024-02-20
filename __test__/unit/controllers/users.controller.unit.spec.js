import { jest } from "@jest/globals";
import { UsersController } from "../../../src/controllers/users.controller.js";

const mockUsersService = {
  createUser: jest.fn(),
  authenticateUser: jest.fn(),
  getUser: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
  locals: jest.fn(),
  ip: jest.fn(),
  headers: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  cookie: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

// postsController의 Service를 Mock Service로 의존성을 주입합니다.
const usersController = new UsersController(mockUsersService);

describe("Users Controller Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test("createUser Method by Success", async () => {
    const samplePosts = [
      {
        userId: "afef-afefad-faefaf",
        name: "name_2",
        email: "example@example.com",
        createdAt: new Date("07 October 2011 15:50 UTC"),
        updatedAt: new Date("07 October 2011 15:50 UTC"),
      },
    ];

    mockUsersService.createUser.mockReturnValue(samplePosts);

    await usersController.createUser(mockRequest, mockResponse, mockNext);

    expect(mockUsersService.createUser).toHaveBeenCalledTimes(1);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: samplePosts,
    });
  });

  test("login Method by Success", async () => {
    const loginRequestBodyParams = {
      email: "example@example.com",
      password: "1256a2dfa",
    };
    const loginRequestIp = "123.44.55.66";
    const loginRequestHeader = { "user-agent": "jest-test" };

    mockRequest.body = loginRequestBodyParams;
    mockRequest.ip = loginRequestIp;
    mockRequest.headers = loginRequestHeader;

    const loginUserReturnValue = {
      accessToken: "jest_accessToken",
      refreshToken: "jest_refreshtoken",
    };
    mockUsersService.authenticateUser.mockReturnValue(loginUserReturnValue);

    const loginPost = await usersController.login(
      mockRequest,
      mockResponse,
      mockNext
    );

    // Service의 login
    expect(mockUsersService.authenticateUser).toHaveBeenCalledTimes(1);
    expect(mockUsersService.authenticateUser).toHaveBeenCalledWith(
      loginRequestBodyParams.email,
      loginRequestBodyParams.password,
      loginRequestIp,
      loginRequestHeader["user-agent"]
    );

    // Response status
    expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      "authorization",
      "Bearer jest_accessToken"
    );
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "jest_refreshtoken"
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // Response json
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: loginUserReturnValue,
    });
  });

  test("getUser Method by Success", async () => {
    const getUserRequestLocals = {
      user: { userId: "UserId_Sucess" },
    };
    mockRequest.locals = getUserRequestLocals;
    // 서비스 계층에 있는 createPost 메서드를 실행했을 때, 반환되는 데이터베이스의 데이터 형식
    const getUserReturnValue = {
      userId: "afef-afefad-faefaf",
      name: "name_2",
      email: "example@example.com",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    mockUsersService.getUser.mockReturnValue(getUserReturnValue);

    const getUser = await usersController.getUser(
      mockRequest,
      mockResponse,
      mockNext
    );

    // Service의 getUser
    expect(mockUsersService.getUser).toHaveBeenCalledTimes(1);
    expect(mockUsersService.getUser).toHaveBeenCalledWith(
      getUserRequestLocals.user
    );

    // Response status
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    // Response json
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: getUserReturnValue,
    });
  });
});
