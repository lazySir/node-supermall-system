const express = require('express')
const router = express.Router()
const router_handle_admin_menus =require('../../../router_handle/admin/acl/menus')

//获取所有权限菜单列表
router.get('/acl/menus/getAll',router_handle_admin_menus.getAll)
//添加权限菜单
router.post('/acl/menus/add',router_handle_admin_menus.add)
//更新权限菜单
router.put('/acl/menus/update',router_handle_admin_menus.update)
//删除权限菜单
router.delete('/acl/menus/delete/:level/:id',router_handle_admin_menus.delete)
module.exports=router