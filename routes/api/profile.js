const express = require('express');
const router  = express.Router();
const auth = require('../../middleware/auth');


/* 
* @route - GET - api/profile/me
* @desc - Get my profile
* @access - protected
*/
router.get('/', auth,  async (req, res) => {
    try{

    } catch (err){
        console.error('Server==>',err.message);
        return res.status(500).json('Server error');

    }
});

module.exports = router;