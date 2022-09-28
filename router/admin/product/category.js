const express =require('express')
const router = express.Router()

const router_handle_admin_category=require('../../../router_handle/admin/product/category')
const {admin_schema_category2Id,admin_schema_category3Id} =require('../../../schema/admin/product/category')
//导入验证表单数据的中间件
const expressJoi =require('@escook/express-joi')
//创建管理员获取三级分类路由

//商品一级分类路由
router.get('/product/getCategory1',router_handle_admin_category.getCategory1)
//商品二级分类路由
router.get('/product/getCategory2/:category1Id',expressJoi(admin_schema_category2Id),router_handle_admin_category.getCategory2)
//商品三级分类路由
router.get('/product/getCategory3/:category2Id',expressJoi(admin_schema_category3Id),router_handle_admin_category.getCategory3)
//所有商品
router.get('/product/getAllCategory',router_handle_admin_category.getAllCategory)
//添加商品分类
router.post('/product/category/add',router_handle_admin_category.addCategory)
//修改商品分类
router.put('/product/category/update',router_handle_admin_category.updateCategory)
//删除商品分类
router.delete('/product/category/delete',router_handle_admin_category.deleteCategory)
module.exports=router