const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const cookieSession = require('cookie-session')
const config = require('config')
const mainRouter = require('./routes/main.router')
const usersRouter = require('./routes/users.router')
const serverConfig = config.get('server')
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


 

// view engine setup
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')



mongoose.connect(process.env.MONGO_URL)
.then(()=> {
  console.log('connect')
})
.catch((err) => { 
  console.log(err)
})

const port = serverConfig.port

app.listen(port, ()=> {
  console.log(`listening on ${port}`)
})