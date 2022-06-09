// 准备：进入邮箱：设置>账户>POP3/SMTP服务(开启之后记得复制密钥)
 
//maileConfig.js
const nodemailer = require('nodemailer');
 
//创建一个smtp服务器
const config = {
    host: 'smtp.qq.com',
    port: 465,
    auth: {
        user: '969060742@qq.com',//开发者邮箱
        pass: 'wvdaizwhziwubbgi',//开发者密钥
        
    }
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);


//发送邮件

module.exports = function (mail){
  transporter.sendMail(mail, function(error, info){
      if(error) {
          return console.log(error);
      }
      console.log('mail sent:', info.response);
  });
};
