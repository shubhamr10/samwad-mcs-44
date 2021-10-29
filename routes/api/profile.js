const express = require('express');
const router  = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/Users');
const Post = require('../../models/Post');


/* 
* @route - GET - api/profile/me
* @desc - Get my profile
* @access - protected
*/
router.get('/me', auth,  async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:"There is no profile for this user"});
        } else {
            return res.json(profile);
        }
    } catch (err){
        console.error('Server==>',err.message);
        return res.status(500).send('Server error');

    }
});

/* 
* @route - POST - api/profile
* @desc -  CREATE or update a user profile
* @access - protected
*/
router.post('/', [
    auth, 
    [
        check('status','Status is required').not().isEmpty(),
        check('skills','Skills is required').not().isEmpty()
    ]
],  async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const { company, website, location, bio, status, githubusername, skills, youtube, linkedin, twitter, instagram, facebook } = req.body;
        // Build profile obj
        const profilefields = {};
        profilefields.user = req.user.id;
        if(company) profilefields.company = company;
        if(website) profilefields.website = website;
        if(location) profilefields.location = location;
        if(bio) profilefields.bio = bio;
        if(status) profilefields.status = status;
        if(githubusername) profilefields.githubusername = githubusername;
        if(skills){
            profilefields.skills = skills.split(',').map(el => el.trim());
        }

        // Build social object;
        profilefields.social = {};
        if(youtube) profilefields.social.youtube = youtube;
        if(linkedin) profilefields.social.linkedin = linkedin;
        if(twitter) profilefields.social.twitter = twitter;
        if(instagram) profilefields.social.instagram = instagram;
        if(facebook) profilefields.social.facebook = facebook;

        let profile = await Profile.findOne({ user: req.user.id });
        if(profile){
            // UPDATE
            profile = await Profile.findOneAndUpdate({ user: req.user.id}, { $set: profilefields }, { new : true});
            return res.json(profile);
        } else {
            // CREATE
            profile = new Profile(profilefields);
            await profile.save();
            return res.json(profile);
        }
    } catch (err){
        console.error('Server==>',err.message);
        return res.status(500).send('Server error');

    }
});


/* 
* @route - GET - api/profile
* @desc -  GET ALL PROFILES
* @access - public
*/

router.get('/', async (req, res) => {
    try{
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err){
        console.error('Server==>',err.message);
        return res.status(500).send('Server error');
    }
});


/* 
* @route - GET - api/profile/user/:user_id
* @desc -  GET PROFILE BY USER ID
* @access - public
*/
router.get('/user/:user_id', async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg : 'Profile not found.!'});
        } else {
            return res.json(profile);
        }
    } catch (err){
        console.error('Server==>',err.message);
        if(err.kind === 'ObjectId'){
            return res.status(400).json({msg : 'Profile not found.!'});
        } else {
            return res.status(500).send('Server error');
        }
    }
});

/* 
* @route - delete - api/profile
* @desc -  delete PROFILES, users and & posts
* @access - protected
*/

router.delete('/', auth ,  async (req, res) => {
    try{
        // @todo - user posts and profile
        // REMOVE USER POST
        await Post.deleteMany({user:req.user.id});
        // Remove profile
        await Profile.findOneAndRemove({ user : req.user.id });
        // Remove User
        await User.findOneAndRemove({ _id : req.user.id });


        return res.json({ msg :'User deleted'});
    } catch (err){
        console.error('Server==>',err.message);
        return res.status(500).send('Server error');
    }
});


/* 
* @route - PUT - api/profile/experience
* @desc -  Add or update a profile experience
* @access - protected
*/

router.put('/experience', [
    auth,
    [
        check('title', 'Title is required!').not().isEmpty(),
        check('company','Company is required!').not().isEmpty(),
        check('from','From date is required!').not().isEmpty()
    ]
] , async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array()});
        } else {
            const { title, company, from , to, location , current, description } = req.body;
            const newExp = { title, company, from , to, location , current, description };

            const profile = await Profile.findOne({ user: req.user.id});
            profile.experience.unshift(newExp);
            await profile.save();

            return res.json(profile);
        }
    } catch (error) {
        console.error('Server==>',error.message);
        return res.status(500).send('Server error');
    }
})


/* 
* @route - PUT - api/profile/experience/:exp_id
* @desc -  DELETE THE EXPERIENCE
* @access - protected
*/

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});

        // GET removeIndex - Method One
        // const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        // console.log(removeIndex)
        // profile.experience.splice(removeIndex, 1);
        // await profile.save();

        // My Style
        profile.experience = profile.experience.filter( exp => exp._id != req.params.exp_id);
        profile.save();
        return res.json(profile);
    } catch (error) {
        console.error('Server==>',error.message);
        return res.status(500).send('Server error');
    }
});

/* 
* @route - PUT - api/profile/education
* @desc -  Add or update a profile education
* @access - protected
*/

router.put('/education', [
    auth,
    [
        check('school', 'School is required!').not().isEmpty(),
        check('degree','Degree is required!').not().isEmpty(),
        check('fieldofstudy','Field of study is required!').not().isEmpty(),
        check('from','From date is required!').not().isEmpty()
    ]
] , async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array()});
        } else {
            const { school, degree, from , to, fieldofstudy , current, description } = req.body;
            const newEdu = { school, degree, from , to, fieldofstudy , current, description };

            const profile = await Profile.findOne({ user: req.user.id});
            profile.education.unshift(newEdu);
            await profile.save();

            return res.json(profile);
        }
    } catch (error) {
        console.error('Server==>',error.message);
        return res.status(500).send('Server error');
    }
})


/* 
* @route - PUT - api/profile/education/:edu_id
* @desc -  DELETE THE education
* @access - protected
*/

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});

        // GET removeIndex - Method One
        // const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        // console.log(removeIndex)
        // profile.education.splice(removeIndex, 1);
        // await profile.save();

        // My Style
        profile.education = profile.education.filter( exp => exp._id != req.params.edu_id);
        profile.save();
        return res.json(profile);
    } catch (error) {
        console.error('Server==>',error.message);
        return res.status(500).send('Server error');
    }
});


/* 
* @route - PUT - api/profile/github/:username
* @desc -  Get the user repos from Github
* @access - public
*/

router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubclientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{'user-agent':'node.js'}
        };
        request(options, (error, response, body)=> {
            if(error){
                console.log(console.error(error));
            }
            if(response.statusCode !== 200){
                return res.status(404).json({msg:'No Github profile found'});
            }
            return res.json(JSON.parse(body));
        })
    } catch (error) {
        console.error('Server==>',error.message);
        return res.status(500).send('Server error');
    }
})


module.exports = router;