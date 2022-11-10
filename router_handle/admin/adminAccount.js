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
exports.login = async (req, res) => {
  let adminInfo = req.body
  let tokenStr = ''
  //1.判断账号与密码是否匹配
  try {
    await new Promise((resolve, reject) => {
      const sql = 'select * from admin where username=?'
      db.query(sql, adminInfo.username, (err, results) => {
        if (err) reject(err)
        if (results.length !== 1) reject('无匹配账号')
        //TODO 判断密码是否一致
        const compareResult = bcrypt.compareSync(adminInfo.password, results[0].password)
        if (!compareResult) reject('密码错误')
        //TODO:在服务器生成Token的字符串
        const admin = { ...results[0], password: '' } //...为展开运算符 后面是把对象的属性覆盖
        //对用户的信息进行加密 生成Token
        //三个参数:  加密对象  解密字符串 有效时长
        tokenStr = jwt.sign(admin, config.token.jwtSecretKey, { expiresIn: config.token.expiresIn })
        resolve('ok')
      })
    })
  } catch (err) {
    return res.cc(err)
  }
  //2.根据adminInfo.username查询admin表中对应的admin_id
  let admin_id=''
  try {
    await new Promise((resolve,reject)=>{
      const sql = `select admin_id from admin where username=?`
      db.query(sql,adminInfo.username,(err,results)=>{
        if(err)reject(err)
        admin_id=results[0]['admin_id']
        resolve('ok')
      })
    })
  } catch (err) {
    return res.cc(err)
  }
  //3.根据admin_id查询adminInfo1表中的state是否为1
  let state=''
  try {
    await new Promise((resolve,reject)=>{
      const sql = `select state from adminInfo1 where admin_id=?`
      db.query(sql,admin_id,(err,results)=>{
        if(err)reject(err)
        state=results[0]['state']
        resolve('ok')
      })
    })
  } catch (err) {
    return res.cc(err)
  }
  //4.如果state不为1则返回账号被禁用
  if(state!=1){
    return res.cc('账号被禁用')
  }

  res.json({
    success: true,
    code: 200,
    message: '登录成功',
    data: {
      token: 'Bearer ' + tokenStr,
    },
  })
}

//管理员退出登录
exports.logout = (req, res) => {
  res.json({
    code: 200,
    data: 'success',
    message: '退出登录成功！',
  })
}
