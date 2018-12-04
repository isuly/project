var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'mail.ru',
  auth: {
    user: 'isulyshka@mail.ru',
    pass: 'literatyra'
  }
});

var mailOptions = {
  from: 'isulyshka@mail.ru',
  to: 'isulyfahretdinova@gmail.com',
  subject: 'тестовая отправка из май в жмайл',
  text: 'ых ых ых ых'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});