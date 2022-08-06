const express = require('express')
const router = express.Router()
const router_handle_admin_file = require('../../../router_handle/admin/public/fileUpload')
/**
 更新头像要用到的插件
 */
 const multer = require('multer')
 const pswStore = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'public/admin/fileUpload/pswMngImg/')
   },
   filename: function (req, file, cb) {
     cb(null, file.originalname)
   },
 })
 const upload = multer({ storage: pswStore })
router.post('/pswStore/fileUpload', upload.single('img'), router_handle_admin_file.pswMngImg)
module.exports=router