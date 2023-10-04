import mongoose from "mongoose";

const { Schema } = mongoose;

const Postschema = new Schema({
  caption: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("posts", Postschema);

export default Post;
