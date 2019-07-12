const bcrypt = require('bcryptjs');

const User = require('../models/user');

const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');



const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: "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"
    }
}));
exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: 'login',
        errorMessage: message
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            req.flash('error', 'We can\'t find user with that E-mail');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch) {
                req.session.user = user;
                req.session.isLoggedIn = true;
                return req.session.save(err=> {
                    console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error', 'Invalid Password');
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        path: 'signup',
        errorMessage: message
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const rePassword = req.body.rePassword;
    const username = req.body.username;
    User.findOne({email: email})
    .then(userDoc => {
        if(userDoc) {
            req.flash('error', 'This email already exists, try to login.');
            return res.redirect('/signup');
        }
        return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: username,
                email: email,
                password: hashedPassword,
                cart: {items:[]}
            });
            return user.save();
        })
        .then(results => {
            res.redirect('/login');
           return transporter.sendMail({
                to: email,
                from: 'success@node-shop.com',
                subject: 'Welcome to the most powerful node shop ever',
                html: "<h1>Congratulations!</h1><h2>You have successfully signed up.<h2>"
            });
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(()=> {
        res.redirect('/');
    });
}