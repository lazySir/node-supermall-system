const express = require('express')
const router = express.Router()
const router_handle_admin_file = require('../../router_handle/admin/fileUpload')
/**
 更新头像要用到的插件
 */
 const multer = require('multer')
 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'public/pswMngImg/')
   },
   filename: function (req, file, cb) {
     cb(null, file.originalname)
   },
 })
 const upload = multer({ storage: storage })
router.post('/fileUpload', upload.single('img'), router_handle_admin_file.fileUpload)
module.exports=router