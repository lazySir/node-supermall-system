//通用功能模块
const express = require('express')
const router = express.Router()
const router_handle_common = require('../../router_handle/commonHandle/svgCaptcha')

//获取图片验证码
router.get('/getSvgCaptcha/:data',router_handle_common.getSvgCaptcha)
module.exports=router