const express = require('express')
const router = express.Router()
const router_handle_admin_Account =require('../../router_handle/admin/adminAccount')
//管理员获取指定分类下的所有attrList
router.post('/admin/login',router_handle_admin_Account.login)
router.post('/admin/register',router_handle_admin_Account.register)
router.post('/admin/logout',router_handle_admin_Account.logout)
module.exports=router