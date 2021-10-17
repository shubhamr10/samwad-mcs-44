const express = require('express');
const router  = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

/* 
* @route - GET - api/auth
* @desc - GET USER DETAILS
* @access - protected
*/
router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err){
        console.err(err);
        return res.status(500).json('Server error');
    }
});

/* 
* @route - POST - api/auth
* @desc - Authentication user and get tokem
* @access - public
*/
router.post('/', 
    check('email','Please include a valid name').isEmail(),
    check('password','Password is required!').exists()
    ,  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    } else {
        const { email, password } = req.body;
        try{
            // See if the user exists
            let user = await User.findOne({email});
            if(!user){
                return res.status(400).json({
                    errors:[{
                        msg:'Invalid credentials'
                    }]
                })
            }
            // math the email and password
            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.status(400).json({
                    errors:[{
                        msg:'Invalid credentials'
                    }]
                })
            }

            // Create a json payload
            const payload = {
                user:{
                    id:user.id,
                }
            };

            jwt.sign(payload, config.get('jwtSecret'), { expiresIn:36000000 }, (err, token)=> {
                if(err){
                    throw err;
                } else {
                    return res.json({ token });
                }
            });
            // return jsonwebtoken
        } catch(err){
            console.error(err);
            return res.status(500).send('Server Error!');
        }
    }
});

module.exports = router;