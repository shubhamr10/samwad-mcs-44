const express = require('express');
const router  = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

const Post = require('../../models/Post');
const User = require('../../models/Users');
const Profile = require('../../models/Profile');


/* 
* @route - POST - api/posts
* @desc -  CREATE A POST
* @access - protected
*/
router.post('/', [
    auth,
    [
        check('text','Text is required').not().isEmpty(),

    ]
], async(req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        } else {
            const user = await User.findById(req.user.id).select('-password');
            const newPost = {
                text:req.body.text,
                name:user.name,
                avatar:user.avatar,
                user:req.user.id
            };

            const post = new Post(newPost);
            await post.save();

            return res.json(post);
        }
    } catch (error) {
        console.error('Server==>',error.message);
        return res.status(500).send('Server error');
    }
});



/* 
* @route - GET - api/posts
* @desc -  GET ALL POST
* @access - protected
*/

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({date:-1});
        return res.json(posts);
    } catch (error) {
        console.error('Server==>',error.message);
        return res.status(500).send('Server error');
    }
});

/* 
* @route - GET - api/posts/:id
* @desc -  GET POST BY ID
* @access - protected
*/

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({msg:'No post found!'})
        return res.json(post);
    } catch (error) {
        console.error('Server==>',error.message);        
        if(error.kind === 'ObjectId'){
            return res.status(400).json({msg : 'Post not found.!'});
        } else {
            return res.status(500).send('Server error');
        }
    }
});

/* 
* @route - DELETE - api/posts/:id
* @desc -  DELETE A POST
* @access - protected
*/

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'No post found!'})
        }
        // Check whether user owns the post
        else if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorised'});
        } else {
            await post.remove();
            return res.json({msg:'Post Deleted'})
        }
    } catch (error) {
        console.error('Server==>',error.message);        
        if(error.kind === 'ObjectId'){
            return res.status(400).json({msg : 'Post not found.!'});
        } else {
            return res.status(500).send('Server error');
        }
    }
});




module.exports = router;