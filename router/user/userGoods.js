//用户获取商品分类列表
const express = require('express')
const router = express.Router()
const userGoods_handle = require('../../router_handle/user/userGoods')

router.get('/getAllGoodsCategory',userGoods_handle.getAllGoodsCategory)

module.exports = router