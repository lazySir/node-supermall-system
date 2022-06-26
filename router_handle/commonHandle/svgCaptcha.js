//图片验证码包
const svgCaptcha = require('svg-captcha')
//作用是将获取到的session保存到cookie，方便前端访问验证
const cookieParase = require('cookie-parser')
exports.getSvgCaptcha = (req, res) => {
  var captcha = svgCaptcha.create({
    size: 5, // 验证码长度
    ignoreChars: "0oOiIl1", // 验证码字符中排除某些字符
    noise: 6, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
});
  // 保存到session,忽略大小写
  req.session = captcha.text.toLowerCase()//后面这东西的内容是验证码的内容
  //保存到cookie 方便前端调用验证
  res.cookie('captcha', req.session)
  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(String(captcha.data))//输出svg
}
