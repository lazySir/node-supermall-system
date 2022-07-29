const express = require('express')
const router = express.Router()
const admin_handle_adminInfo=require('../../router_handle/admin/adminInfo')
router.get('/getAdminInfo', admin_handle_adminInfo.getAdminInfo)
module.exports = router