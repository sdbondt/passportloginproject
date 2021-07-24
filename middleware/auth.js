const auth = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    };
    req.flash('msg', 'You must be logged in to do that');
    res.redirect('/')
};

module.exports = auth;