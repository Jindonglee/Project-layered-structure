export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  /** 유저생성 API */
  createUser = async (req, res, next) => {
    try {
      const userData = await this.usersService.createUser(req.body);
      return res.status(201).json({ data: userData });
    } catch (err) {
      next(err);
    }
  };

  /** 유저 로그인 API */
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const tokens = await this.usersService.authenticateUser(
        email,
        password,
        req.ip,
        req.headers["user-agent"]
      );
      res.cookie("authorization", `Bearer ${tokens.accessToken}`);
      res.cookie("refreshToken", tokens.refreshToken);
      return res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  };
  /** 게시글 상세조회 API */
  getUser = async (req, res, next) => {
    try {
      const userData = await this.usersService.getUser(req.locals.user);
      return res.status(201).json({ data: userData });
    } catch (err) {
      next(err);
    }
  };
}
