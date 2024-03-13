import { Router } from "express";
import { User } from "../db/userSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import config from "../config.js";
import userMiddleware from "../middleware/userMiddleware.js";
import fetch from "node-fetch";

dotenv.config();
const router = Router();
const secret = config.JWT_SECRET;

router.get("/", (req, res) => {
  res.send("hello");
});
router.post("/signup", async (req, res) => {
  const { email, password, fullname } = req.body;
  try {
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(409).send("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.status(201).send("User created successfully!");
  } catch (error) {
    res.status(500).send("An error occurred during signup.");
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
      res.json({ token });
    } else {
      res.status(401).json({
        message: "Incorrect email or password!",
      });
    }
  } catch (error) {
    res.status(500).send("An error occurred during signin.");
  }
});

router.get("/latestMovies", userMiddleware, async (req, res) => {
  // const { email, password } = req.body;
  try {
    const url =
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
    // const options = {
    //   method: "GET",
    //   headers: {
    //     accept: "application/json",
    //     Authorization:
    //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjNmZjNkMTZhOGRiYjZmNGY3ZDM1ZTcxMGU4Mzc4NSIsInN1YiI6IjY1ODdkMDBlNDc3MjE1NTk4MzQzY2RiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XycOjjp8_-CS2cJInsg7tHOt2G3K-HAoo9S5r5cfmZU",
    //   },
    // };
    const latestMovies = await fetch(url, process.env.OPTIONS);
    const json = await latestMovies.json();
    res.send(json);
  } catch (error) {
    res.status(500).send("Error while fetching movies");
  }
});

router.get("/video/:id", userMiddleware, async (req, res) => {
  try {
    const movie_id = req.params.id;
    const url = `https://api.themoviedb.org/3/movie/${movie_id}/videos?language=en-US`;
    // const options = {
    //   method: "GET",
    //   headers: {
    //     accept: "application/json",
    //     Authorization:
    //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjNmZjNkMTZhOGRiYjZmNGY3ZDM1ZTcxMGU4Mzc4NSIsInN1YiI6IjY1ODdkMDBlNDc3MjE1NTk4MzQzY2RiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XycOjjp8_-CS2cJInsg7tHOt2G3K-HAoo9S5r5cfmZU",
    //   },
    // };
    const video = await fetch(url, process.env.OPTIONS);
    const json = await video.json();
    res.send(json);
  } catch (error) {
    res.status(500).send("Error while fetching movies");
  }
});
export default router;
