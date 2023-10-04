import express from "express";
import cloudinary from "../cloudinary/cloudinary.js";
import Post from "../models/Post.js";

const postRouter = express.Router();

postRouter.post("/uploadpost", async (req, res) => {
  const file = req.files?.files;
  cloudinary.uploader.upload(
    file.tempFilePath,
    async (uploadErr, uploadRes) => {
      if (uploadErr) {
        console.log("Upload error:", uploadErr);
        return res
          .status(500)
          .json({ success: false, message: "Upload error" });
      }
      try {
        await Post.create({
          caption: req.body.caption,
          userId: req.body.id,
          image: uploadRes.url,
        });
        res.json({ success: true });
      } catch (error) {
        console.log(error);
        res.json({ success: false, data: error });
      }
    }
  );
});

postRouter.get("/getpostdata/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const userData = await Post.find({ userId });
    if (!userData) res.json({ error: "No User" });
    return res.json({ success: true, userData: userData });
  } catch (error) {
    return res.status(400).json({ error: "Db error" });
  }
});

postRouter.put("/editpost/:id", async (req, res) => {
  const id = req.params.id;

  try {
    let updateData = {
      caption: req.body.caption,
    };
    const post = await Post.findByIdAndUpdate(id, updateData);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found." });
    }

    return res.json({
      success: true,
      message: "Post Updated.",
    });
  } catch (error) {
    console.log("Database error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

postRouter.delete("/deletepost/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const post = await Post.findByIdAndDelete(_id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found." });
    }

    return res.json({
      success: true,
      message: "Post Deleted.",
    });
  } catch (error) {
    console.log("Database error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

export default postRouter;
