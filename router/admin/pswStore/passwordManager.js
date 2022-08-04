
const express = require('express')
const router =express.Router()

const router_handle_admin_pswManager = require('../../../router_handle/admin/pswStore/passwordManager')



router.get('/getPswManagerList/:page/:limit',router_handle_admin_pswManager.getPswManagerList)
router.post('/addPswManager',router_handle_admin_pswManager.addPswManager)
router.put('/updatePswManager',router_handle_admin_pswManager.updatePswManager)
router.delete('/deletePswManager/:id',router_handle_admin_pswManager.deletePswManager)
module.exports = router