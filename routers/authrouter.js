const express = require('express');
const { getLogin, getRegister, postRegister, getUser, login, logout, getHomepage, getImage, postImage } = require('../controllers/authController');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const { upload, resize } = require('../middleware/imageupload');

router.get('/', getHomepage);

router.get('/login', getLogin);

router.get('/register', getRegister);

router.post('/register', 
    body('confirmpassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
    }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    postRegister);

router.get('/account', auth, getUser);

router.post('/login', passport.authenticate('local'), login);

router.post('/logout', auth, logout);

router.get('/githublogin', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => { res.redirect('/')});


router.get('/image', auth, getImage);

router.post('/image', auth, upload, resize, postImage)


module.exports = router;