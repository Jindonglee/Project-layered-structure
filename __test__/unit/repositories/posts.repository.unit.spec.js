import { jest } from "@jest/globals";
import { PostsRepository } from "../../../src/repositories/posts.repository";

const mockResume = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockDataSource = {
  getRepository: jest.fn().mockReturnValue(mockResume),
};
// const dataSource = jest.mock("typeorm", () => ({
//   getRepository: jest.fn().mockImplementation((entityName) => {
//     // 원하는 엔티티명에 따라서 적절한 모의 객체 반환
//     switch (entityName) {
//       case "Resume":
//         return mockResume;
//       default:
//         return jest.fn();
//     }
//   }),
// }));

let postsRepository = new PostsRepository(mockDataSource);

describe("Posts Repository Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // findAllPosts 메서드 테스트
  test("findAllPosts Method", async () => {
    const ResumeList = [
      {
        resumeId: "1234",
        title: "Post 1",
        status: "APPLY",
        user: {
          name: "User",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resumeId: "4567",
        title: "Post 2",
        status: "APPLY",
        user: {
          name: "User",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Prisma의 findMany 메서드를 설정하여 가짜 데이터를 반환하도록 함
    postsRepository.dataSource
      .getRepository("Resume")
      .find.mockResolvedValue(ResumeList);

    // findAllPosts 메서드 호출
    const result = await postsRepository.findAllPosts("createdAt", "desc");

    // 반환된 결과가 예상한 결과와 일치하는지 확인
    expect(result).toEqual(ResumeList);

    // Prisma의 findMany 메서드가 한 번 호출되었는지 확인
    expect(
      postsRepository.dataSource.getRepository("Resume").find
    ).toHaveBeenCalledTimes(1);

    // Prisma의 findMany 메서드가 올바른 인자로 호출되었는지 확인
    expect(
      postsRepository.dataSource.getRepository("Resume").find
    ).toHaveBeenCalledWith({
      select: {
        resumeId: true,
        title: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });
  });

  // createPost 메서드 테스트
  test("createPost Method", async () => {
    // create 메서드가 반환할 가짜 데이터
    const createdPost = {
      resumeId: "1234",
      userId: "12345",
      title: "제목입니다",
      content: "내용입니다",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Prisma의 create 메서드를 설정하여 가짜 데이터를 반환하도록 함
    postsRepository.prisma.resume.create.mockResolvedValue(createdPost);

    // createPost 메서드 호출
    const result = await postsRepository.createPost(
      createdPost.userId,
      createdPost.title,
      createdPost.content
    );

    // 반환된 결과가 예상한 결과와 일치하는지 확인
    expect(result).toEqual(createdPost);

    expect(postsRepository.prisma.resume.create).toHaveBeenCalledTimes(1);
    expect(postsRepository.prisma.resume.create).toHaveBeenCalledWith({
      data: {
        userId: createdPost.userId,
        title: createdPost.title,
        content: createdPost.content,
      },
    });
  });

  // findPostById 메서드 테스트
  test("findPostById Method", async () => {
    // findUnique 메서드가 반환할 가짜 데이터
    const Post = {
      resumeId: "1234",
      title: "제목입니다",
      content: "내용입니다.",
      status: "APPLY",
      user: {
        name: "User",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Prisma의 findUnique 메서드를 설정하여 가짜 데이터를 반환하도록 함
    postsRepository.prisma.resume.findUnique.mockResolvedValue(Post);

    // findPostById 메서드 호출
    const result = await postsRepository.findPostById(Post.resumeId);

    // 반환된 결과가 예상한 결과와 일치하는지 확인
    expect(result).toEqual(Post);

    // Prisma의 findUnique 메서드가 한 번 호출되었는지 확인
    expect(postsRepository.prisma.resume.findUnique).toHaveBeenCalledTimes(1);

    // Prisma의 findUnique 메서드가 올바른 인자로 호출되었는지 확인
    expect(postsRepository.prisma.resume.findUnique).toHaveBeenCalledWith({
      where: { resumeId: Post.resumeId },
      select: {
        resumeId: true,
        title: true,
        content: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  // updatePost 메서드 테스트
  test("updatePost Method", async () => {
    // update 메서드가 반환할 가짜 데이터
    const updatePost = {
      resumeId: 1,
      title: "Updated Post",
      content: "Updated content",
      status: "active",
      user: {
        name: "User 1",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const userId = "12345";

    // Prisma의 update 메서드를 설정하여 가짜 데이터를 반환하도록 함
    postsRepository.prisma.resume.update.mockResolvedValue(updatePost);

    // updatePost 메서드 호출
    const result = await postsRepository.updatePost(
      updatePost.resumeId,
      updatePost.title,
      updatePost.content,
      userId
    );

    // 반환된 결과가 예상한 결과와 일치하는지 확인
    expect(result).toEqual(updatePost);

    // Prisma의 update 메서드가 한 번 호출되었는지 확인
    expect(postsRepository.prisma.resume.update).toHaveBeenCalledTimes(1);

    // Prisma의 update 메서드가 올바른 인자로 호출되었는지 확인
    expect(postsRepository.prisma.resume.update).toHaveBeenCalledWith({
      data: {
        title: updatePost.title,
        content: updatePost.content,
      },
      where: {
        resumeId: updatePost.resumeId,
        userId: userId,
      },
      select: {
        resumeId: true,
        title: true,
        content: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  // deletePost 메서드 테스트
  test("deletePost Method", async () => {
    // Prisma의 delete 메서드가 반환할 가짜 데이터
    const deletePost = {
      resumeId: 1,
      title: "제목입니다",
      content: "내용입니다.",
      status: "APPLY",
      user: {
        name: "User",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const userId = "12345";

    // Prisma의 delete 메서드를 설정하여 가짜 데이터를 반환하도록 함
    postsRepository.prisma.resume.delete.mockResolvedValue(deletePost);

    // deletePost 메서드 호출
    const result = await postsRepository.deletePost(
      deletePost.resumeId,
      userId
    );

    // 반환된 결과가 예상한 결과와 일치하는지 확인
    expect(result).toEqual(deletePost);

    // Prisma의 delete 메서드가 한 번 호출되었는지 확인
    expect(postsRepository.prisma.resume.delete).toHaveBeenCalledTimes(1);

    // Prisma의 delete 메서드가 올바른 인자로 호출되었는지 확인
    expect(postsRepository.prisma.resume.delete).toHaveBeenCalledWith({
      where: {
        resumeId: deletePost.resumeId,
        userId: userId,
      },
    });
  });
});
