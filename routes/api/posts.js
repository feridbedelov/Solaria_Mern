const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const { check, validationResult } = require("express-validator")
const Post = require("../../models/Post")
const User = require("../../models/Users")


// @route /api/posts/ Create a new post 

router.post("/", [auth, [check("text", "Text field is required").not().isEmpty()]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select("-password");

        const newPost = new Post({
            text: req.body.text,
            user: req.user.id,
            avatar: user.avatar,
            name: user.name
        })

        const post = await newPost.save();

        return res.json(post);

    } catch (error) {
        return res.status(500).send("Server Error")
    }


})


// /api/posts/  => Get all posts

router.get("/", auth, async (req, res) => {

    try {

        const posts = await Post.find().sort({ data: -1 });

        res.json(posts)

    } catch (error) {
        return res.status(500).send("Server Error")
    }


})


// /api/posts/:id  => Get  post by id

router.get("/:id", auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        res.json(post)

    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        return res.status(500).send("Server Error")
    }


})


// /api/posts/:id  => Delete  post by id

router.delete("/:id", auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User is not authorized" })
        }

        await post.remove();

        res.json({ msg: "Post is removed" })

    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" })
        }
        return res.status(500).send("Server Error")
    }


})


// /api/posts/like/:id  Like the post

router.put("/like/:id", auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post already liked" })
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes);

    } catch (error) {
        return res.status(500).send("Server Error")
    }

})






// /api/posts/unlike/:id  unLike the post

router.put("/unlike/:id", auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: "Post has not been liked yet" })
        }

        const unlikedIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(unlikedIndex, 1);

        await post.save()

        res.json(post.likes);

    } catch (error) {
        return res.status(500).send("Server Error")
    }

})



// Write Comment To Specific Post  /api/posts/comment/:id

router.post("/comment/:id", [auth, [check("text", "Text field is required").not().isEmpty()]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select("-password");
        const post = await Post.findById(req.params.id);


        const newComment = {
            text: req.body.text,
            user: req.user.id,
            avatar: user.avatar,
            name: user.name
        }

        post.comments.unshift(newComment);

        await post.save();

        return res.json(post.comments);

    } catch (error) {
        return res.status(500).send("Server Error")
    }


})


// Delete Comment Of Specific Post  /api/posts/comment/:id

router.post("/comment/:id", [auth, [check("text", "Text field is required").not().isEmpty()]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select("-password");
        const post = await Post.findById(req.params.id);


        const newComment = {
            text: req.body.text,
            user: req.user.id,
            avatar: user.avatar,
            name: user.name
        }

        post.comments.unshift(newComment);

        await post.save();

        return res.json(post.comments);

    } catch (error) {
        return res.status(500).send("Server Error")
    }


})



// Delete a specific comment /api/posts/comment/:id/:comment_id

router.delete("/comment/:id/:comment_id", auth , async (req,res) => {

    try {
        
        const post = await Post.findById(req.params.id);

        const comment = await post.comments.find(item => item.id === req.params.comment_id);

        if(!comment){
            return res.status(404).json({msg: "No comment found"});
        }

        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:"User is not authorized"})
        }

        const removedIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removedIndex,1);

        await post.save();

        res.json(post.comments);




    } catch (error) {
        return res.status(500).send("Server Error")
    }

})






module.exports = router