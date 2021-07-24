require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
const GitHubStrategy = require('passport-github').Strategy;
const path = require('path');

const authRouter = require('./routers/authrouter');
const Account = require('./models/account');

const PORT = process.env.PORT || 3000;
const rootDir = path.dirname(require.main.filename);
const viewsPath = path.join(rootDir, 'views');
const publicPath = path.join(rootDir, 'public');
const store = new MongoDBStore({
    uri: process.env.MONGO_DB,
    collection: 'project3-sessions',
  });


app.use(express.static(publicPath));
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(flash());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );

//passport functionaliteit: set req.user + createStrategy
app.use(passport.initialize());
app.use(passport.session());

passport.use(Account.createStrategy());
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'https://samdb-passportloginproject.herokuapp.com/github/callback',
}, async function(accessToken, refreshToken, profile, cb) {
  try {
    let user = await Account.findOne({ githubId: profile.id });
  if (!user) {
    const newAccount = new Account({githubId: profile.id, name: profile.username, email: profile.email || undefined });
    user = await newAccount.save()
  }
    return cb(null, user);
  } catch (e) {
    cb(e, null)
  }
  
}))
// dit werkt zonder github strategie erbij
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Account.findOne({_id: mongoose.Types.ObjectId(id)});
    done(null, user)
  } catch (e) {
    done(e, null)
  }

});


app.use((req, res, next) => {
    if(req.user) {
        res.locals.isLoggedIn = true;
        res.locals.user = req.user;
    } else {
        res.locals.isLoggedIn = false;
        res.locals.user = null;
    }
    next()
})

app.use('/', authRouter);



mongoose.connect(process.env.MONGO_DB, { useFindAndModify: false ,useUnifiedTopology: true, useNewUrlParser: true });

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})