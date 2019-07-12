const path = require('path');
const errorContoller = require('./controllers/error');
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const scrf = require('csurf');
const flash = require('connect-flash');

const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const mongodbStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://islam:ozyKGjXmWIHhOeMM@cluster0-jrlnr.mongodb.net/shop';

const store = new mongodbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const User = require('./models/user');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));

// Session setup
app.use(session({secret: 'fkjsdkfbwjc', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

const csrfProtection = scrf();
app.use(csrfProtection);
app.use(flash());

// Res Locals
app.use((req, res, next)=> {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Routes
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(express.static(path.join(__dirname, 'public')));

// 404 page
app.use(errorContoller.get404);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
.then(result => {
    console.log('Connected to database');
    app.listen(3000, () => {
        console.log('connected to port 3000');
    });
})
.catch(err => {
    console.log(err);
});