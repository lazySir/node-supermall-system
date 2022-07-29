const express = require('express')
const router = express.Router()
const router_handle_admin_attr =require('../../router_handle/admin/attr')
const {admin_schema_attr} =require('../../schema/admin/attr')
//导入验证表单数据的中间件
const expressJoi =require('@escook/express-joi')
//管理员获取指定分类下的所有attrList
router.get('/goods/attrInfoList/:category1Id/:category2Id/:category3Id',expressJoi(admin_schema_attr),router_handle_admin_attr.getAttrInfoList)
//添加属性名与属性值 
router.post('/goods/saveAttrInfo',router_handle_admin_attr.saveAttrInfo)
module.exports=router