//通用功能模块
const express = require('express')
const router = express.Router()
const router_handle_common = require('../../router_handle/commonJS/svgCaptcha')

//获取图片验证码
router.get('/getSvgCaptcha',router_handle_common.getSvgCaptcha)
module.exports=router