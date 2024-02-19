import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { UsersController } from "../controllers/users.controller.js";
import { UsersService } from "../services/users.service.js";
import { UsersRepository } from "../repositories/users.repository.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);

const usersController = new UsersController(usersService); // PostsController를 인스턴스화 시키니다.

/** 유저 생성 API */
router.post("/sign-up", usersController.createUser);

/** 로그인 API */
router.post("/login", usersController.login);

/** 유저정보 조회 API */
router.get("/userInfo", authMiddleware, usersController.getUser);

export default router;
