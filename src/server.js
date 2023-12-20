const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const cookieSession = require('cookie-session')
const config = require('../config/default.json')
const mainRouter = require('./routes/main.router')
const usersRouter = require('./routes/users.router')
const serverConfig = config.server
const app = express()

require('dotenv').config()
const cookieEncryptionKey = 'supersecret-key'

app.use(cookieSession({
  keys: [cookieEncryptionKey]
}))

app.use(function (requset, response, next) {
  if (requset.session && !requset.session.regenerate) {
    requset.session.regenerate = (cb) => {
      cb()
    }
  }
  if (requset.session && !requset.session.save){
    requset.session.save =(cb) => {
      cb()
    }
  }
  next()
})

app.get('/', (req, res) => {
  res.send("Root Path");
});

app.get('/api',(req,res)=> {
  res.send("HI")
})

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/static', express.static(path.join(__dirname, 'public')))


app.use('/', mainRouter)
app.use('/auth', usersRouter)


app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')



mongoose.connect("mongodb+srv://JSM:sj01080108%40%40@express.eehytgh.mongodb.net/?retryWrites=true&w=majority")
.then(()=> {
  console.log('connect')
})
.catch((err) => { 
  console.log(err)
})

const port = process.env.PORT || serverConfig.port

app.listen(port, ()=> {
  console.log(`listening on ${port}`)
})