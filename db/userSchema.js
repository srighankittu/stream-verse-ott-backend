import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "../config.js";

dotenv.config();

// eslint-disable-next-line no-undef
mongoose.connect(config.MONGOOSE_URL);

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model("User", userSchema);
