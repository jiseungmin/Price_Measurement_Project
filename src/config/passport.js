const passport = require('passport')
const User = require("../models/users.models")
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const KakaoStrategy = require("passport-kakao").Strategy

passport.serializeUser((user, done)=> {
  done(null, user.id)
})

passport.deserializeUser((id, done)=> {
  User.findById(id)
  .then(user => {
    done(null, user)
  })
}) 


passport.use("local", new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found` });
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { msg: "Invalid email or password." });
        }
      });
    } catch (err) {
      return done(err);
    }
  }
));

/*const GoogleStrategyConfig = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  scope: ['email', 'profile']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    } else {
      let user = new User();
      user.email = profile.emails[0].value;
      user.googleId = profile.id;
      await user.save();
      done(null, user);
    }
  } catch (err) {
    done(err);
  }
});


/*const kakaoStrategyConfig = new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENTKEY,
  callbackURL: '/auth/kakao/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let existingUser = await User.findOne({ kakaoId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    } else {
      let user = new User();
      // 이메일이 있는지 확인하고, 없으면 null 또는 다른 기본값을 할당
      user.email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      user.kakaoId = profile.id;
      await user.save();
      done(null, user);
    }
  } catch (err) {
    done(err);
  }
});*/




//passport.use('google', GoogleStrategyConfig)
//passport.use('kakao', kakaoStrategyConfig)


