# node_shop-back

node后台系统

# 下载依赖

npm i

# 依赖说明

@escook/express-joi: 一个用于验证和处理 Express.js 请求参数的中间件。

@hapi/joi: 一个功能强大的 JavaScript 对象模式验证库，用于验证和处理数据。

bcryptjs: 用于进行密码哈希和验证的库，通常用于用户认证和安全性。

body-parser: Express.js 中间件，用于解析请求主体中的数据，如 JSON、URL 编码和表单数据。

cookie-parser: Express.js 中间件，用于解析和处理 HTTP 请求中的 cookie。

cors: 用于处理 Express.js 应用程序中的跨域资源共享（CORS）的中间件。

crypto-js: 一个 JavaScript 加密库，提供了各种加密算法和工具函数。

express: Node.js 的 Web 应用程序框架，用于构建灵活的 Web 服务和 API。

express-jwt: Express.js 中间件，用于验证和解析 JSON Web 令牌（JWT）。

joi: 一个用于数据验证和模式描述的 JavaScript 库，可以用于验证和处理各种数据类型。

jsonwebtoken: 用于生成和验证 JSON Web 令牌（JWT）的库。

multer: 用于处理 Express.js 应用程序中的文件上传的中间件。

mysql: 用于在 Node.js 中连接和操作 MySQL 数据库的库。

node-localstorage: 一个在 Node.js 中模拟浏览器本地存储的库。

nodemailer: 一个用于发送电子邮件的 Node.js 库，支持各种邮件传输协议。

svg-captcha: 用于生成 SVG 格式验证码的库，常用于生成和验证图像验证码。


# 运行项目

supervisor app.js 

注意：需要有全局的supervisor包。

```
npm i supervisor -g

```

# 用户注册接口

url：/api/register

method：post

body：phone password code email

return：

```javascript
{
    "code": 200,
    "message": "注册成功"
}
```

# 请求验证码接口

url：/api/sendCode

method：get

body：email

return：邮件

<br/>

# 用户登录接口

url：/api/login

method：post

body：phone password

return：

```javascript
{
code:200/205
message:
token:
}
```

# 获取用户信息接口

url：/user/getUserInfo

method:get

Header：token

```javascript
{
    "code": 200,
    "message": "获取用户信息成功",
    "data": {
        "phone": "13675026019",
        "nic_name": null,
        "head_img": "/userImg/1.png",
        "email": null
    }
}
```

# 上传用户头像

url：/user/changeAvatar

body：file :{  key：img value ：图片 }

return

```javascript
{
    "code": 200,
    "message": "上传头像成功",
    "imgUrl": "/userImg/IMG_7866(20220606-221427).JPG"
}
```

# 获取图片验证码

url：/api/getSvgCaptcha

前端将生成cookie：key：captch value：图片内容 

返回

```javascript
svg图片  

在img的src中直接写接口地址即可
```

# 用户获取所有商品分类

url：/user/getAllGoodsCategory

method:get

Header：token

return 

```javascript
{
  "code":200,
  "message":"成功",
  "data":data
}
```

# 管理员获取商品分类

## 一级分类

url：/admin/goods/getCategory1

method：get

return

```javascript
{
	"code": 200,
	"message": "成功",
	"data": data
}
```

## 二级分类

url：/admin/goods/getCategory2/:category1Id

method：get

return

```javascript
{
	"code": 200,
	"message": "成功",
	"data": data
}
```

## 三级分类

url：/admin/goods/getCategory3/:category2Id

method：get

return

```javascript
{
	"code": 200,
	"message": "成功",
	"data": data
}
```

# 管理员获取平台属性

url：/admin/goods/attrInfoList/:category1Id/:category2Id/:category3Id

method:get

return

```javascript
{
	"code": 200,
	"message": "成功",
	"data": [
		{	"id": 1,
		"attr_name": "仙剑奇侠传",
		"valueList:[]
		}
		    	]
}
```

# 管理员注册

url:/api/admin/register

method:post

data:

```
username
password
code  (内部码)
```

# 管理员登陆接口

url:/api/admin/login

method:post

data:

```
username
password
```

# 管理员退出登录接口

url：/api/admin/logout

method:post

# 获取管理员信息

url：/admin/getAdminInfo

method：get

Header：Authorization ：token

# 获取账号密码管理获取列表

url：/admin/pswStore/get/:page/:limit

method:get

Header：Authorization ：token

# 账号密码管理添加数据

url：/admin/pswStore/add

method：post

Header：Authorization ：token

data:pswForm

# 上传图片

url：/api/pswStore/fileUpload

method：post

Body：{

file： key：img value ：

}


# 账号密码管理修改数据接口

url:/admin/pswStore/update

method:put

Header：Authorization ：token

data:pswForm

# 账号密码管理删除数据接口

url：/admin/pswStore/delete/:id

method:delete

Header：Authorization ：token

# tradeMark获取列表

url：/admin/product/tradeMark/get/:page/:limit

method:get

Header：Authorization ：token

# tradeMark新增品牌

url：/admin/product/tradeMark/add

method：post

Header：Authorization ：token

data:pswForm

# tradeMark上传图片

url：/api/tradeMark/fileUpload

method：post

Body：{

file： key：img value ：

}

# tradeMark修改数据接口

url:/admin/product/tradeMark/update

method:put

Header：Authorization ：token

data:pswForm

# tradeMark删除数据接口

url：/admin/product/tradeMark/delete/:id

method:delete

Header：Authorization ：token
