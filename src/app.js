import express from "express";
import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());

const URL = process.env.CORS_URL;
const corsOptions = {
  origin: URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", router);
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
