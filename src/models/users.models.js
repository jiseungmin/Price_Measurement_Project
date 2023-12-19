const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    minLenght:5
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  kakaoId: {
    type: String,
    unique: true,
    sparse: true
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
  
  bcrypt.compare(plainPassword, this.password, function(err,isMatch){
    if(err) return cb(err)
    cb(null, isMatch)
  })  

}

const saltRounds = 10
userSchema.pre('save', function(next){
  let user = this
  if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function (err, salt){
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
     next()
  }
})


const User = mongoose.model('User',userSchema)
 
module.exports = User