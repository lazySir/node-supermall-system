//----------引包区-----------------

//引入express
const express = require('express')
//引入解析json的包
const bodyParser = require('body-parser')
//引入path
const path = require('path')

//-----------构建服务器实例区---------------

//创建express实例
const app = express()
//解决跨域问题
const cors = require('cors')
//---------------静态资源--------------

app.use(express.static(path.join(__dirname, 'public')))

//------------使用服务器插件区域-------------

app.use(cors())
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

//配置解析json数据的中间件
app.use(bodyParser.json({ limit: '1mb' })) //body-parser 解析json格式数据
app.use(
  bodyParser.urlencoded({
    //此项必须在 bodyParser.json 下面,为参数编码
    extended: true,
  }),
)

//-----------路由之前的中间件---------------

//路由之前封装res.cc这个函数 （中间件）
app.use((req, res, next) => {
  //code 默认值为205 表示失败  如果为200表示成功
  //err的值可能是一个错误对象 也可能是一个错误的描述对象
  res.cc = function (err, code = 205) {
    res.json({
      code,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})
//路由之前配置解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
//凡是以api开头的接口都不需要解密 path里面写的是正则表达式
app.use(expressJWT({ secret: config.token.jwtSecretKey }).unless({ path: [/^\/api/] })) //解密过程

//------------管理员路由模块------------------------

//-------------管理员公用模块-------------------------

//管理员账户的管理
const adminAccount = require('./router/admin/adminAccount')
app.use('/api', adminAccount)

//管理员账户信息
const adminInfo = require('./router/admin/adminInfo')
app.use('/admin', adminInfo)
//上传图片
const fileUpload = require('./router/admin/public/fileUpload')
app.use('/api', fileUpload)
//----------------后端权限模块-----------------------------
//菜单管理
const adminAclMenus = require('./router/admin/acl/menus')
app.use('/admin', adminAclMenus)
//角色管理
const adminAclRole = require('./router/admin/acl/role')
app.use('/admin', adminAclRole)
//用户管理
const adminUser = require('./router/admin/acl/user')
app.use('/admin',adminUser)
//----------------产品模块----------------------------------
//分类管理
const adminCategoryModuel = require('./router/admin/product/category')
app.use('/admin', adminCategoryModuel)
//attr管理
const adminAttrModule = require('./router/admin/product/attr')
app.use('/admin', adminAttrModule)
//品牌管理
const adminTradeMarkModule = require('./router/admin/product/tradeMark')
app.use('/admin', adminTradeMarkModule)
//spu管理
const adminSpuModule = require('./router/admin/product/spu')
app.use('/admin', adminSpuModule)
//sku管理
const adminSkuModule = require('./router/admin/product/sku')
app.use('/admin', adminSkuModule)
//---------------账号密码存储模块----------------------------
//管理账号密码
const passwordManager = require('./router/admin/pswStore/passwordManager')
app.use('/admin', passwordManager)

//-------------用户注册路由模块-----------------------

//导入并使用用户注册路由模块
const userRouter = require('./router/user/userAccount')
app.use('/api', userRouter)
//捕获验证失败的错误，并把验证失败的结果响应给客户端
const joi = require('@hapi/joi')
//错误级别中间件
app.use((err, req, res, next) => {
  //schema数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  //token认证失败
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  //未知错误
  res.cc(err)
})

//--------------公共功能区域路由--------
//生成图片验证码
const svgCaptcha = require('./router/commonRouter/svgCaptcha')
app.use('/api', svgCaptcha)

//---------------用户模块------------
//导入并使用用户信息路由模块
const userinfoRouter = require('./router/user/userinfo')
app.use('/user', userinfoRouter)

//导入并使用用户获取所有商品分类的路由模块
const userGetAllGoodsCategory = require('./router/user/userGoods')
app.use('/user', userGetAllGoodsCategory)

//---------------服务器------------------
//创建服务器
app.listen(3007, () => {
  
  console.log('api server is running at http://127.0.0.1:3007')
})
