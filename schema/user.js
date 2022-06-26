const joi = require('@hapi/joi')
// string()值必须是字符串
// alphanum():只能是包含a-z A-Z，0-9的字符串
// min（length）：最小长度
// max（length）：最大长度
// required（）：值是必填项，不能为undefined
// pattern（正则表达式）：必须符合正则表达式的规则

//用户名的验证规则
const phone = joi.string().pattern(/^(?:(?:\+|00)86)?1\d{10}$/).required().error(new Error('请输入正确的手机号码！'))
//密码的验证规则
const password = joi.string().required().error(new Error('密码不能为空！'))
//邮箱的验证规则
const email = joi.string().required().email().error(new Error('请输入正确的邮箱！'))
const code = joi.number().required().error(new Error('验证码错误！'))
//注册和登录表单的验证规则对象
exports.user_schema_register = {
  body: {
    phone,
    password,
    code,
    email,
  },
}

exports.user_schema_login = {
  body: {
    phone,
    password,
  },
}
exports.user_schema_email = {
  email,
}
