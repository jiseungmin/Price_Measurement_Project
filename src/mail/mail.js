const { response } = require("express")
const mailer = require("nodemailer")
const welcom  = require("./welcome_template")
const goodbye = require("./goodbye_template")
const welcome = require("./welcome_template")
const transporter = mailer.createTransport({
  service: "Gmail",
  auth: {
    user: "",
    pass: ""
  }
})

const getEmailData = (to, name, template) => {
  let data =null

  switch (template) {
    case "welcome":
      data = {
        from: '보내는 사람 이름',
        to,
        subject:`Hello ${name}`,
        html: welcome()
      }
      break;
    
    case "goodbye":
      data = {
        from: '보내는 사람 이름',
        to,
        subject:`goodbye ${name}`,
        html: goodbye()
      }
      break;
    default:
      data;
  }
  return data
}

const sendmail = (to, name, type) => {
  const transporter = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: 'sm4638463864@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mail = getEmailData(to,name,type)

  transporter.sendMail(mail, (error, response)=> {
    if (error){
      console.log(error)
    }else {
      console.log('email sent successfully')
    }

    transporter.close()
  })
}


module.exports = sendmail