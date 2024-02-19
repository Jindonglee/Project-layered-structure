import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UsersService {
  // postsRepository = new PostsRepository();

  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  createUser = async (userData) => {
    const { name, email, password, passwordConfirm, grade } = userData;

    if (password !== passwordConfirm) {
      throw new Error("비밀번호 확인과 일치해야 합니다.");
    }

    const isExistUser = await this.usersRepository.getUserByEmail(email);

    if (isExistUser) {
      throw new Error("이미 중복된 이메일이 존재합니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersRepository.createUser(
      name,
      email,
      hashedPassword,
      grade
    );

    return newUser;
  };

  authenticateUser = async (email, password, ip, userAgent) => {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new Error("존재하지 않는 이메일입니다.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "12h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  };

  getUser = async (user) => {
    const userInfo = await this.usersRepository.getUserById(user);
    if (!userInfo) {
      throw new Error("유저정보가 존재하지 않습니다.");
    }
    return userInfo;
  };
}
