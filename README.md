# node_shop-back
node后台系统
# 下载依赖
npm i
# 运行项目

supervisor app.js 

注意：需要有全局的supervisor包。（npm i supervisor -g）
# 注册接口

method：post

参数：phone password code email

接口：/api/register

返回：

```javascript
{
	"code": 200,
	"message": "注册成功"
}
```

# 请求验证码接口

method：get

接口：/api/sendCode

参数：email

返回：邮件

<br/>

# 登录接口

method：post

参数：phone password

地址：/api/login

返回：

```javascript
{
code:200/205
message:
token:
}
```

# 获取用户信息接口

method:get

接口：/user/getUserInfo

header：需要token

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

接口：/user/changeAvatar

header：需要token

参数：file   key：img value ：图片 

返回

```javascript
{
	"code": 200,
	"message": "上传头像成功",
	"imgUrl": "/userImg/IMG_7866(20220606-221427).JPG"
}
```
