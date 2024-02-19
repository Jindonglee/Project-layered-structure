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
        throw new Error("InvalidParamsError");
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
        throw new Error("ValidationError");
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

      if (!title || !content) {
        throw new Error("ValidationError");
      }

      const patchedPost = await this.postsService.updatePost(
        resumeId,
        title,
        content,
        req.locals.user.userId
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

      const deletedPost = await this.postsService.deletePost(resumeId, userId);

      return res.status(201).json({ data: deletedPost });
    } catch (err) {
      next(err);
    }
  };
}
