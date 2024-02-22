import dataSource from "../typeorm/index.js";
dataSource.initialize();

export class PostsRepository {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }
  findAllPosts = async (orderKey, orderValue) => {
    const randomNumber = Math.floor(Math.random() * 6);
    console.log(randomNumber);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, randomNumber * 1000);
    });

    const resumeList = await dataSource.getRepository("Resume").find({
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
      order: { [orderKey]: orderValue.toLowerCase() },
    });
    return resumeList;
  };

  createPost = async (userId, title, content) => {
    const createdPost = await dataSource.getRepository("Resume").save({
      userId,
      title,
      content,
      updatedAt: new Date(),
    });
    return createdPost;
  };

  findPostById = async (resumeId) => {
    const post = await dataSource.getRepository("Resume").findOne({
      where: { resumeId: resumeId },
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
    return post;
  };

  updatePost = async (resumeId, title, content, userId) => {
    const patchedPost = await dataSource
      .getRepository("Resume")
      .update(
        { resumeId: resumeId, userId: userId },
        { title: title, content: content }
      );
    return patchedPost;
  };

  deletePost = async (resumeId, userId) => {
    const deletedPost = await dataSource
      .getRepository("Resume")
      .delete({ resumeId: resumeId, userId: userId });
    return deletedPost;
  };
}
