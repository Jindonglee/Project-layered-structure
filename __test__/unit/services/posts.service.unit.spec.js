import { expect, jest } from "@jest/globals";
import { PostsService } from "../../../src/services/posts.service.js";

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockPostsRepository = {
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let postsService = new PostsService(mockPostsRepository);

describe("Posts Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("findAllPosts Method", async () => {
    const samplePosts = [
      {
        postId: "dafe-dfaef-adfa",
        userId: "archfe-fefa-fefef",
        title: "타이틀 입니다.",
        content: "Contents",
        createdAt: "2024-02-18T08:08:47.730Z",
        updatedAt: "2024-02-18T08:08:47.730Z",
      },
      {
        postId: "dafe-dfaef-ad3fa",
        userId: "archfe-fefa-ffefef",
        title: "타이틀 입니다.",
        content: "Contents",
        createdAt: "2024-02-19T08:08:47.730Z",
        updatedAt: "2024-02-19T08:08:47.730Z",
      },
    ];
    const orderKey = "createdAt";
    const orderValue = "DESC";

    mockPostsRepository.findAllPosts.mockReturnValue(samplePosts);

    const allPosts = await postsService.findAllPosts(orderKey, orderValue);

    expect(mockPostsRepository.findAllPosts).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findAllPosts).toHaveBeenCalledWith(
      orderKey,
      orderValue
    );
    expect(allPosts).toEqual(
      samplePosts.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  });

  /** findPostById 테스트 */
  test("findPostById Method By Success", async () => {
    const samplePost = {
      resumeId: "postUuid",
      title: "타이틀 입니다.",
      content: "테스트 코드용 내용입니다.",
      createdAt: "2024-02-19T08:08:47.730Z",
      updatedAt: "2024-02-19T08:08:47.730Z",
    };
    mockPostsRepository.findPostById.mockReturnValue(samplePost);
    const foundPost = await postsService.findPostById(samplePost.resumeId);

    expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(
      samplePost.resumeId
    );
    expect(foundPost).toEqual({
      resumeId: samplePost.resumeId,
      title: samplePost.title,
      content: samplePost.content,
      createdAt: samplePost.createdAt,
      updatedAt: samplePost.updatedAt,
    });
  });

  /** createPost 테스트 */
  test("createPost Method By Success", async () => {
    const samplePost = {
      resumeId: "postUuid",
      userId: "asdf-asdf",
      title: "타이틀 입니다.",
      content: "테스트 코드용 내용입니다.",
      createdAt: "2024-02-19T08:08:47.730Z",
      updatedAt: "2024-02-19T08:08:47.730Z",
    };
    mockPostsRepository.createPost.mockReturnValue(samplePost);

    const createdPost = await postsService.createPost(
      "asdf-asdf",
      samplePost.title,
      samplePost.content
    );
    expect(mockPostsRepository.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.createPost).toHaveBeenCalledWith(
      "asdf-asdf",
      samplePost.title,
      samplePost.content
    );

    expect(createdPost).toEqual({
      resumeId: samplePost.resumeId,
      userId: "asdf-asdf",
      title: samplePost.title,
      content: samplePost.content,
      createdAt: samplePost.createdAt,
      updatedAt: samplePost.updatedAt,
    });
  });

  /** updatePost 테스트 */
  test("updatePost Method By Success", async () => {
    const samplePost = {
      resumeId: "postUuid",
      title: "타이틀 입니다.",
      content: "테스트 코드용 내용입니다.",
      createdAt: "2024-02-19T08:08:47.730Z",
      updatedAt: "2024-02-19T08:08:47.730Z",
    };
    const userId = "asdf-asdf";
    mockPostsRepository.findPostById.mockReturnValue(samplePost);

    const updatedPost = await postsService.updatePost(
      samplePost.resumeId,
      samplePost.title,
      samplePost.content,
      userId
    );

    expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(2);
    expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(
      samplePost.resumeId
    );

    expect(mockPostsRepository.updatePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.updatePost).toHaveBeenCalledWith(
      samplePost.resumeId,
      samplePost.title,
      samplePost.content,
      userId
    );

    expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(
      samplePost.resumeId
    );

    expect(updatedPost).toEqual({
      resumeId: samplePost.resumeId,
      title: samplePost.title,
      content: samplePost.content,
      createdAt: samplePost.createdAt,
      updatedAt: samplePost.updatedAt,
    });
  });

  test("updatePost Method By Not Found Post Error", async () => {
    const samplePost = null;
    mockPostsRepository.findPostById.mockReturnValue(samplePost);
    try {
      await postsService.updatePost(1232123, "sdfsdfsd", "adfa", 1234);
    } catch (err) {
      expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(1232123);

      expect(mockPostsRepository.updatePost).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("존재하지 않는 게시글입니다.");
    }
  });
  /** deletePost 테스트 */
  test("deletePost Method By Success", async () => {
    const samplePost = {
      resumeId: "postUuid",
      title: "타이틀 입니다.",
      content: "테스트 코드용 내용입니다.",
      createdAt: "2024-02-19T08:08:47.730Z",
      updatedAt: "2024-02-19T08:08:47.730Z",
    };
    mockPostsRepository.findPostById.mockReturnValue(samplePost);

    const deletedPost = await postsService.deletePost(
      samplePost.resumeId,
      "123fe4"
    );

    expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(
      samplePost.resumeId
    );

    expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(
      "postUuid",
      "123fe4"
    );

    expect(deletedPost).toEqual({
      resumeId: samplePost.resumeId,
      title: samplePost.title,
      content: samplePost.content,
      createdAt: samplePost.createdAt,
      updatedAt: samplePost.updatedAt,
    });
  });

  test("deletePost Method By Not Found Post Error", async () => {
    const samplePost = null;
    mockPostsRepository.findPostById.mockReturnValue(samplePost);
    try {
      await postsService.deletePost(1232123, "sdfsdfsd");
    } catch (err) {
      expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(1232123);

      expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual("존재하지 않는 게시글입니다.");
    }
  });
});
