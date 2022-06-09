//注册与登录模块
const express = require('express')
const router = express.Router()
const router_handle_user=require('../router_handle/user')
//引入joi验证规则
const {user_schema} =require('../schema/user')
//导入验证表单数据的中间件
const expressJoi =require('@escook/express-joi')

//注册
router.post('/register',expressJoi(user_schema),router_handle_user.register)
//发送注册验证码
router.get('/sendCode',router_handle_user.sendCode)
//登录
router.post('/login',expressJoi(user_schema),router_handle_user.login)
module.exports = router
