# node_shop-back

node后台系统

# 下载依赖

npm i

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
