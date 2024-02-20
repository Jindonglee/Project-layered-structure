import { jest } from "@jest/globals";
import { PostsController } from "../../../src/controllers/posts.controller.js";

// posts.service.js 에서는 아래 5개의 Method만을 사용합니다.
const mockPostsService = {
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
  query: jest.fn(),
  locals: jest.fn(),
  params: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

// postsController의 Service를 Mock Service로 의존성을 주입합니다.
const postsController = new PostsController(mockPostsService);

describe("Posts Controller Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    mockResponse.status.mockReturnValue(mockResponse);
  });

  //게시글 조회 테스트
  test("getPosts Method by Success", async () => {
    const samplePosts = [
      {
        resumeId: "1dfaefasf",
        title: "Title_2",
        content: "Content",
        createdAt: new Date("07 October 2011 15:50 UTC"),
        updatedAt: new Date("07 October 2011 15:50 UTC"),
      },
      {
        resumeId: "1dfaefa",
        title: "Title_1",
        content: "Content",
        createdAt: new Date("06 October 2011 15:50 UTC"),
        updatedAt: new Date("06 October 2011 15:50 UTC"),
      },
    ];

    mockPostsService.findAllPosts.mockReturnValue(samplePosts);

    await postsController.getPosts(mockRequest, mockResponse, mockNext);

    expect(mockPostsService.findAllPosts).toHaveBeenCalledTimes(1);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: samplePosts,
    });
  });

  /** 게시글 상세조회 테스트 */
  test("getPostById Method by Success", async () => {
    const samplePosts = [
      {
        resumeId: "1dfaefasf",
        status: "APPLY",
        title: "Title_2",
        createdAt: new Date("07 October 2011 15:50 UTC"),
        updatedAt: new Date("07 October 2011 15:50 UTC"),
      },
    ];
    const getPostByIdRequestParams = {
      resumeId: "resumeId_Success",
    };
    mockRequest.params = getPostByIdRequestParams;

    mockPostsService.findPostById.mockReturnValue(samplePosts);

    await postsController.getPostById(mockRequest, mockResponse, mockNext);

    expect(mockPostsService.findPostById).toHaveBeenCalledTimes(1);
    expect(mockPostsService.findPostById).toHaveBeenCalledWith(
      getPostByIdRequestParams.resumeId
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: samplePosts,
    });
  });
  test("getPostById Method by Invalid Params Error", async () => {
    mockRequest.params = {};

    await postsController.getPostById(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error("이력서id를 입력해주세요"));
  });

  // 게시글 작성 테스트
  test("createPost Method by Success", async () => {
    const createPostRequestBodyParams = {
      title: "Title_Success",
      content: "Content_Success",
    };
    const createPostRequestLocals = {
      user: { userId: "UserId_Sucess" },
    };
    mockRequest.body = createPostRequestBodyParams;
    mockRequest.locals = createPostRequestLocals;
    // 서비스 계층에 있는 createPost 메서드를 실행했을 때, 반환되는 데이터베이스의 데이터 형식
    const createPostReturnValue = {
      resumeId: "dfafesf",
      ...createPostRequestBodyParams,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    mockPostsService.createPost.mockReturnValue(createPostReturnValue);

    const createdPost = await postsController.createPost(
      mockRequest,
      mockResponse,
      mockNext
    );

    // Service의 createPost
    expect(mockPostsService.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostsService.createPost).toHaveBeenCalledWith(
      createPostRequestLocals.user.userId,
      createPostRequestBodyParams.title,
      createPostRequestBodyParams.content
    );

    // Response status
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    // Response json
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: createPostReturnValue,
    });
  });

  test("createPost Method by Invalid Params Error", async () => {
    mockRequest.body = {
      title: "Title_InvalidParamsError",
    };

    await postsController.createPost(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new Error("데이터 형식이 잘못되었습니다.")
    );
  });

  // 게시글 수정 테스트
  test("updatePost Method by Success", async () => {
    const updatePostRequestBodyParams = {
      title: "Title_Success",
      content: "Content_Success",
    };
    const updatePostRequestLocals = {
      user: { userId: "UserId_Sucess" },
    };
    const updatePostRequestParams = {
      resumeId: "resumeId_Success",
    };
    mockRequest.body = updatePostRequestBodyParams;
    mockRequest.locals = updatePostRequestLocals;
    mockRequest.params = updatePostRequestParams;

    const updatePostReturnValue = {
      resumeId: "dfafesf",
      ...updatePostRequestBodyParams,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    mockPostsService.updatePost.mockReturnValue(updatePostReturnValue);

    const updatedPost = await postsController.updatePost(
      mockRequest,
      mockResponse,
      mockNext
    );

    // Service의 updatePost
    expect(mockPostsService.updatePost).toHaveBeenCalledTimes(1);
    expect(mockPostsService.updatePost).toHaveBeenCalledWith(
      updatePostRequestParams.resumeId,
      updatePostRequestBodyParams.title,
      updatePostRequestBodyParams.content,
      updatePostRequestLocals.user.userId
    );

    // Response status
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    // Response json
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: updatePostReturnValue,
    });
  });
  test("updatePost Method by Invalid Params Error", async () => {
    mockRequest.body = {
      title: "Title_InvalidParamsError",
    };

    await postsController.updatePost(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new Error("데이터 형식이 잘못되었습니다.")
    );
  });

  /** 게시글 삭제 테스트 */
  test("deletePost Method by Success", async () => {
    const deletePostRequestLocals = {
      user: { userId: "UserId_Sucess" },
    };
    const deletePostRequestParams = {
      resumeId: "resumeId_Success",
    };

    mockRequest.locals = deletePostRequestLocals;
    mockRequest.params = deletePostRequestParams;

    const deletePostReturnValue = {
      resumeId: "dfafesf",
      title: "It's title",
      content: "It's content",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    mockPostsService.deletePost.mockReturnValue(deletePostReturnValue);

    const deletedPost = await postsController.deletePost(
      mockRequest,
      mockResponse,
      mockNext
    );

    // Service의 updatePost
    expect(mockPostsService.deletePost).toHaveBeenCalledTimes(1);
    expect(mockPostsService.deletePost).toHaveBeenCalledWith(
      deletePostRequestParams.resumeId,
      deletePostRequestLocals.user.userId
    );

    // Response status
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    // Response json
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: deletePostReturnValue,
    });
  });
  test("deletePost Method by Invalid Params Error", async () => {
    mockRequest.params = {};

    await postsController.deletePost(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new Error("데이터 형식이 잘못되었습니다.")
    );
  });
});
