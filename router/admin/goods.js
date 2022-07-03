const express =require('express')
const router = express.Router()

const router_handle_admin_goods=require('../../router_handle/admin/goods')
const {admin_schema_category2Id,admin_schema_category3Id} =require('../../schema/admin/goods')
//导入验证表单数据的中间件
const expressJoi =require('@escook/express-joi')
//创建管理员获取三级分类路由

//商品一级分类路由
router.get('/goods/getCategory1',router_handle_admin_goods.getCategory1)
//商品二级分类路由
router.get('/goods/getCategory2/:category1Id',expressJoi(admin_schema_category2Id),router_handle_admin_goods.getCategory2)
//商品三级分类路由
router.get('/goods/getCategory3/:category2Id',expressJoi(admin_schema_category3Id),router_handle_admin_goods.getCategory3)

module.exports=router