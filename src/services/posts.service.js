export class PostsService {
  // postsRepository = new PostsRepository();

  constructor(postsRepository) {
    this.postsRepository = postsRepository;
  }
  findAllPosts = async (orderKey, orderValue) => {
    const posts = await this.postsRepository.findAllPosts(orderKey, orderValue);

    return posts;
  };

  createPost = async (userId, title, content) => {
    const createdPost = await this.postsRepository.createPost(
      userId,
      title,
      content
    );

    return {
      postId: createdPost.postId,
      userId: createdPost.userId,
      title: createdPost.title,
      content: createdPost.content,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
    };
  };

  findPostById = async (resumeId) => {
    const post = await this.postsRepository.findPostById(resumeId);

    return post;
  };

  updatePost = async (resumeId, title, content, userId) => {
    const post = await this.postsRepository.findPostById(resumeId);
    if (!post) throw new Error("존재하지 않는 게시글입니다.");

    await this.postsRepository.updatePost(resumeId, title, content, userId);

    const patchedPost = await this.postsRepository.findPostById(resumeId);
    return patchedPost;
  };

  deletePost = async (resumeId, userId) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const post = await this.postsRepository.findPostById(resumeId);
    if (!post) throw new Error("존재하지 않는 게시글입니다.");

    // 저장소(Repository)에게 데이터 삭제를 요청합니다.
    await this.postsRepository.deletePost(resumeId, userId);

    return {
      resumeId: post.resumeId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };
}
