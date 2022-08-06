const express = require('express')
const router = express.Router()
const router_handle_admin_file = require('../../../router_handle/admin/public/fileUpload')
/**
 更新头像要用到的插件
 */

 const multer = require('multer')

 //账号密码存储
 const pswStore = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'public/admin/fileUpload/pswMngImg/')
   },
   filename: function (req, file, cb) {
     cb(null, file.originalname)
   },
 })
 const pswStoreUpload = multer({ storage: pswStore })
 router.post('/pswStore/fileUpload', pswStoreUpload.single('img'), router_handle_admin_file.pswMngImg)
 //-------------------------------------------------------------
 //tradeMark 品牌管理
 const tradeMark = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/admin/fileUpload/tradeMarkImg/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
 const tradeMarkUpload = multer({ storage: tradeMark })
 router.post('/product/tradeMark/fileUpload', tradeMarkUpload.single('img'), router_handle_admin_file.tradeMarkImg)
module.exports=router