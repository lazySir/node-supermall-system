
const express = require('express')
const router =express.Router()

const router_handle_admin_pswManager = require('../../router_handle/admin/passwordManager')



router.get('/getPswManagerList/:page/:limit',router_handle_admin_pswManager.getPswManagerList)
router.post('/addPswManager',router_handle_admin_pswManager.addPswManager)
module.exports = router