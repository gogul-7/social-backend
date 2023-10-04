import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

const secureJwt = "social-app";

userRouter.post("/createuser", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);
  const mail = req.body.mail;
  try {
    let userData = await User.findOne({ mail });
    if (!userData) {
      await User.create({
        name: req.body.name,
        location: req.body.location,
        mail: mail,
        password: secPass,
      });
      res.json({ success: true });
    } else {
      return res.json({ errors: true });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, data: error });
  }
});

userRouter.post("/loginuser", async (req, res) => {
  const mail = req.body.mail;
  const userData = await User.findOne({ mail });
  if (!userData) {
    return res.json({ error: "No user" });
  }
  const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
  if (pwdCompare) {
    const data = {
      user: {
        id: userData.id,
      },
    };
    const authToken = jwt.sign(data, secureJwt);
    return res.json({ success: true, authToken: authToken, id: userData.id });
  } else {
    return res.json({ error: "invalid pass" });
  }
});

export default userRouter;
