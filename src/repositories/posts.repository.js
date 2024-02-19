export class PostsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findAllPosts = async (orderKey, orderValue) => {
    const orderByOptions = orderKey
      ? [{ [orderKey]: orderValue.toLowerCase() }]
      : undefined;
    const resumeList = await this.prisma.resume.findMany({
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
      orderBy: orderByOptions,
    });
    return resumeList;
  };

  createPost = async (userId, title, content) => {
    const createdPost = await this.prisma.resume.create({
      data: {
        userId,
        title,
        content,
      },
    });
    return createdPost;
  };

  findPostById = async (resumeId) => {
    const post = await this.prisma.resume.findUnique({
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
    const patchedPost = await this.prisma.resume.update({
      data: {
        title: title,
        content: content,
      },
      where: {
        resumeId: resumeId,
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
    return patchedPost;
  };

  deletePost = async (resumeId, userId) => {
    const deletedPost = await this.prisma.resume.delete({
      where: { resumeId: resumeId, userId: userId },
    });
    return deletedPost;
  };
}
