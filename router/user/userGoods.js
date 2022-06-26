//用户获取商品分类列表
const express = require('express')
const router = express.Router()
const userGoods_handle = require('../../router_handle/user/userGoods')
const {user_schema_email} =require('../../schema/user')
//导入验证表单数据的中间件
const expressJoi =require('@escook/express-joi')
router.get('/getAllGoodsCategory',expressJoi(user_schema_email),userGoods_handle.getAllGoodsCategory)

module.exports = router