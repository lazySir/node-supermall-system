const express = require('express')
const router = express.Router()

/**
 更新头像要用到的插件
 */
 const multer = require('multer')
 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'public/userImg/')
   },
   filename: function (req, file, cb) {
     cb(null, file.originalname)
   },
 })
 const upload = multer({ storage: storage })

//导入路由处理函数模块
const userinfo_handle = require('../../router_handle/user/userinfo')//挂载路由
//获取用户信息接口
router.get('/getUserInfo', userinfo_handle.getUserInfo)
router.post('/changeAvatar', upload.single('img'), userinfo_handle.changeAvatar)
module.exports = router
