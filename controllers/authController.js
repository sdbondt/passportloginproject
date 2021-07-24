const Account = require('../models/account');
const { validationResult } = require('express-validator');

exports.getHomepage = (req, res, next) => {
    const messages = req.flash('msg');
    let msg = null;
    if (messages.length >0) {
        msg = messages[0];
    };
    res.render('homepage', {
        pageTitle: 'Home',
        msg
    })
};

exports.getLogin = (req, res, next) => {
    res.render('login', {
        pageTitle: 'Login here'
    })
};

exports.getRegister = (req, res, next) => {
    const messages = req.flash('msg');
    let msg = null;
    if (messages.length >0) {
        msg = messages[0];
    };
    res.render('register', {
        pageTitle: 'Sign up here',
        msg
    })
};

exports.postRegister = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            pageTitle: 'Sign up here',
            msg: errors.array()[0].msg,
        })
      }
    const { name, password, email } = req.body;
    await Account.register(new Account({ email, name }), password);
    res.redirect('/')
};

exports.getUser = (req, res, next) => {
    res.render('account', {
        pageTitle: 'My account',
        user: req.user,
    })
};

exports.login = async (req, res, next) => {
    res.redirect('/account')
};

exports.logout = async (req, res, next) => {
    req.logout();
    req.flash('msg', 'You logged out');
    res.redirect('/')
};

exports.getImage = (req, res, next) => {
    res.render('image', {
        pageTitle: 'Upload your image'
    })
};

exports.postImage = async (req, res, next) => {
    req.user.image = req.body.photo;
    try {
        await req.user.save();
        res.redirect('/account')
    } catch (e) {
        next(e)
    }
};

