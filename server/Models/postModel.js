import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {type: String, required: true},
    desc: String,
    likes: [],
    image: String,
    score: String
},
{
    timestamps: true,
});

var PostModel = mongoose.model("Posts", postSchema);
export default PostModel