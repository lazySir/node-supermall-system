const db = require('../../db')
//导入bcryptjs  用来加密密码
const bcrypt = require('bcryptjs')
//导入生成token的包
const jwt = require('jsonwebtoken')
//导入全局解密的js文件
const config = require('../../config')

//管理员注册
//注册
exports.register = (req, res) => {
  //获取客户端提交到服务器的用户信息
  const adminInfo = req.body
  //检查注册码是否正确
  if (adminInfo.code != 1115) return res.cc('注册码错误!')
  //定义sql语句查询用户名是否被占用
  const sqlA = 'select * from admin where username=?'
  db.query(sqlA, adminInfo.username, (err, results) => {
    //如果执行sql语句失败
    if (err) {
      return res.cc(err)
    }
    //如果用户名被占用
    if (results.length > 0) {
      return res.cc('账号已被注册')
    }
    //TODO:如果成功 则开始注册
    adminInfo.password = bcrypt.hashSync(adminInfo.password, 10)
    //数据库语句 ：注册账号列表
    const sql = `insert into admin set?`
    db.query(
      sql,
      {
        username: adminInfo.username,
        password: adminInfo.password,
      },
      (err, results) => {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows != 1) {
          return res.cc('注册用户失败')
        }
      },
    )
    res.cc('注册成功', 200)
  })
}

//管理员登陆
exports.login = (req, res) => {
  const adminInfo = req.body
  const sql = 'select * from admin where username=?'
  db.query(sql, adminInfo.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('无匹配账号')
    //TODO 判断密码是否一致
    const compareResult = bcrypt.compareSync(adminInfo.password, results[0].password)
    if (!compareResult) return res.cc('密码错误')
    //TODO:在服务器生成Token的字符串
    const admin = { ...results[0], password: '' } //...为展开运算符 后面是把对象的属性覆盖
    //对用户的信息进行加密 生成Token
    //三个参数:  加密对象  解密字符串 有效时长
    const tokenStr = jwt.sign(admin, config.token.jwtSecretKey, { expiresIn: config.token.expiresIn })
    res.json({
      success:true,
      code: 20000,
      message: '登录成功',
      data:{
        token: 'Bearer ' + tokenStr,
      }

    })
  })
}

//管理员退出登录
exports.logout=(req,res)=>{
  res.json({
    code:200,
    data:'success',
    message:'退出登录成功！'
  })
}