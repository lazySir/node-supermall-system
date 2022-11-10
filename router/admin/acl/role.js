const express = require('express')
const router = express.Router()
const router_handle_admin_role =require('../../../router_handle/admin/acl/role')

router.get('/acl/role/get/:page/:limit',router_handle_admin_role.get)
router.put('/acl/role/updateName',router_handle_admin_role.updateName)
router.post('/acl/role/add',router_handle_admin_role.add)
router.post('/acl/role/search',router_handle_admin_role.search)
router.get('/acl/role/getAuth/:id',router_handle_admin_role.getAuth)
router.put('/acl/role/updateAuth/:id',router_handle_admin_role.updateAuth)
router.delete('/acl/role/deleteRole/:id',router_handle_admin_role.deleteRole)
router.delete('/acl/role/deleteRoles',router_handle_admin_role.deleteRoles)
module.exports=router