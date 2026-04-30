import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to DriptKart API!");
});

app.use("/api/auth", authRouter);

export default app;
