
const express = require('express')
const router =express.Router()

const router_handle_admin_pswManager = require('../../../router_handle/admin/pswStore/passwordManager')



router.get('/pswStore/get/:page/:limit',router_handle_admin_pswManager.getPswManagerList)
router.post('/pswStore/add',router_handle_admin_pswManager.addPswManager)
router.put('/pswStore/update',router_handle_admin_pswManager.updatePswManager)
router.delete('/pswStore/delete/:id',router_handle_admin_pswManager.deletePswManager)
module.exports = router