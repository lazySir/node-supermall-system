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
# 获取图片验证码

接口：/api/getSvgCaptcha

前端将生成cookie：key：captch value：图片内容 

参数：无需参数

返回

```javascript
svg图片  

在img的src中直接写接口地址即可
```

# 用户获取所有商品分类

地址：/user/getAllGoodsCategory

参数：无需参数 

请求头：需要token

返回式例

```javascript
[
	{
		"id": 1,
		"category1_name": "图书、音像、电子书刊",
		"type_id": 0,
		"child": [
			{
				"id": 1,
				"parent_id": 0,
				"category2_name": "电子书刊",
				"type_id": 0,
				"child": [
					{
						"id": 1,
						"parent_id": 0,
						"category3_name": "电子书",
						"type_id": 0
					},
					{
						"id": 2,
						"parent_id": 0,
						"category3_name": "网络原创",
						"type_id": 0
					},
					{
						"id": 3,
						"parent_id": 0,
						"category3_name": "数字杂志",
						"type_id": 0
					},
					{
						"id": 4,
						"parent_id": 0,
						"category3_name": "多媒体图书",
						"type_id": 0
					}
				]
			},
			{
				"id": 2,
				"parent_id": 0,
				"category2_name": "音像",
				"type_id": 1,
				"child": []
			},
			{
				"id": 3,
				"parent_id": 0,
				"category2_name": "英文原版",
				"type_id": 2,
				"child": []
			},
			{
				"id": 4,
				"parent_id": 0,
				"category2_name": "文艺",
				"type_id": 3,
				"child": []
			},
]
```
