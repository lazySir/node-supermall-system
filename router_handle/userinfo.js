//导入数据库操作模块
const db = require('../db/index')

//获取用户信息路由
exports.getUserInfo = (req, res) => {
  //req对象身上的user属性 是Token解析成功，express-jwt中间件帮我们挂载上去的
  const sql = `select * from userinfo where phone=?`
  db.query(sql, req.user.phone, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取用户信息失败')
    res.send({
      code: 200,
      message: '获取用户信息成功',
      data: results[0],
    })
  })
}

//更改用户头像接口
exports.changeAvatar = (req, res, next) => {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  let file = req.file
  const sqlStr = `update userinfo  set head_img=("${'/userImg/' + file.originalname}") where phone=?`
  db.query(sqlStr, req.user.phone, (err, results) => {
    if (err) return res.cc(err)
    return res.json({
      code:200,
      message:'上传头像成功',
      imgUrl: `${'/userImg/' + file.originalname}`,
    })
  })
}
