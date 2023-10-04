import express from "express";
import cors from "cors";
import connectDB from "./mongoDb/server.js";
import * as dotenv from "dotenv";
import fileUpload from "express-fileupload";
import userRouter from "./routes/UserRouter.js";
import postRouter from "./routes/PostRouter.js";

const app = express();

dotenv.config();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const PORT = 8080 || process.env.PORT;

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

const startSever = async () => {
  try {
    connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => console.log(`App has started on server ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

app.use("/api", userRouter);
app.use("/api", postRouter);

startSever();
