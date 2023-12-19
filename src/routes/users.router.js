const express = require('express');
const User = require('../models/users.models')
const passport = require('passport');
const sendmail = require('../mail/mail');
const usersRouter = express.Router();

usersRouter.post('/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send("NO"); // 로그인 실패
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.send("OK"); // 로그인 성공
    });
  })(req, res, next);
});
usersRouter.post('/logout', (req, res, next) => {
  req.logOut(function (err) {
    if(err) { return next(err)}
    res.redirect('/login')
  })
})

usersRouter.post('/signup', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
   // sendmail("sm4638463864@gmail.com", "Jiseungmin", "welcome")
    res.send('OK')
  } catch (error){
    console.error(error)
  }
}) 

usersRouter.get('/google', passport.authenticate('google'))
usersRouter.get('/google/callback', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}))

usersRouter.get('/kakao', passport.authenticate('kakao'))
usersRouter.get('/kakao/callback', passport.authenticate('kakao', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}))

module.exports = usersRouter