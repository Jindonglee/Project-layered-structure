export class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }

  /** 게시글 조회 API */
  getPosts = async (req, res, next) => {
    try {
      const orderKey = req.query.orderKey;
      const orderValue = req.query.orderValue;
      const posts = await this.postsService.findAllPosts(orderKey, orderValue);

      return res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  };

  /** 게시글 생성 API */
  createPost = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const { userId } = req.locals.user;

      if (!title || !content) {
        throw new Error("데이터 형식이 잘못되었습니다.");
      }

      const createdPost = await this.postsService.createPost(
        userId,
        title,
        content
      );

      return res.status(201).json({ data: createdPost });
    } catch (err) {
      next(err);
    }
  };
  /** 게시글 상세조회 API */
  getPostById = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      if (!resumeId) {
        throw new Error("이력서id를 입력해주세요");
      }
      const post = await this.postsService.findPostById(resumeId);

      return res.status(200).json({ data: post });
    } catch (err) {
      next(err);
    }
  };
  /** 게시글 수정 API */
  updatePost = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const { title, content } = req.body;
      const { userId } = req.locals.user;

      if (!title || !content || !resumeId) {
        throw new Error("데이터 형식이 잘못되었습니다.");
      }

      const patchedPost = await this.postsService.updatePost(
        resumeId,
        title,
        content,
        userId
      );

      return res.status(201).json({ data: patchedPost });
    } catch (err) {
      next(err);
    }
  };

  /** 게시글 삭제 API */
  deletePost = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const { userId } = req.locals.user;
      if (!resumeId) {
        throw new Error("데이터 형식이 잘못되었습니다.");
      }

      const deletedPost = await this.postsService.deletePost(resumeId, userId);

      return res.status(201).json({ data: deletedPost });
    } catch (err) {
      next(err);
    }
  };
}
