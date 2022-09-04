const express = require('express')
const router = express.Router()
const router_handle_admin_attr =require('../../../router_handle/admin/product/attr')
const {admin_schema_attr} =require('../../../schema/admin/product/attr')
//导入验证表单数据的中间件
const expressJoi =require('@escook/express-joi')
//管理员获取指定分类下的所有attrList
router.get('/product/attr/getListById/:category1Id/:category2Id/:category3Id',expressJoi(admin_schema_attr),router_handle_admin_attr.getListById)
//添加属性名与属性值 
router.post('/product/attr/add',router_handle_admin_attr.add)
router.put('/product/attr/update',router_handle_admin_attr.update)
router.delete('/product/attr/delete/:Id',router_handle_admin_attr.delete)
router.get('/product/attr/getListByName/:searchName',router_handle_admin_attr.getListByName)
module.exports=router