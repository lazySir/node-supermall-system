const joi = require('@hapi/joi')
// string()值必须是字符串
// alphanum():只能是包含a-z A-Z，0-9的字符串
// min（length）：最小长度
// max（length）：最大长度
// required（）：值是必填项，不能为undefined
// pattern（正则表达式）：必须符合正则表达式的规则

//用户名的验证规则
const phone = joi.required()
//密码的验证规则
const password = joi
  // .pattern(/^[\S]{6,12}$/)
  .required()

const code = joi.required()
const email = joi.required()
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