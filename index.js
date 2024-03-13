import cors from "cors";
import express from "express";
import router from "./routes/userRoute.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/user", router);

app.get("/hello", (req, res) => {
  res.send("Hello!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
