//导入数据库
const db = require('../../db/index')
//导入bcryptjs  用来加密密码
const bcrypt = require('bcryptjs')
//导入生成token的包
const jwt = require('jsonwebtoken')
//导入全局解密的js文件
const config = require('../../config')
//引入发送邮箱的文件
const maileConfig = require('../../utils/sendCode/maileFonfig')
const LocalStorage = require('node-localstorage').LocalStorage,
  localStorage = new LocalStorage('./scratch')

//注册
exports.register = async (req, res) => {
  // //获取客户端提交到服务器的用户信息
  const userinfo = req.body
  //获取缓存的验证码
  //里面有邮箱（email） code 和 发送时间（time）
  let userCodeInfo = localStorage.getItem(userinfo.email)
  //将json格式转化为对象
  userCodeInfo = JSON.parse(userCodeInfo)
  //判断验证码是否已过期
  const registerTime = new Date().getTime()
  if (registerTime - userCodeInfo.time >= 5 * 1000 * 60) {
    res.json({
      code: 205,
      message: '验证码已过期',
    })
    return
  }
  //如果验证码未过期  且验证码正确
  if (userCodeInfo.code == userinfo.emailCode) {
    //1.定义sql语句查询用户名是否被占用
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from admin where username = "${userinfo.username}"`
        db.query(sql, (err, results) => {
          if (err) return reject(err)
          if (results.length > 0) reject('用户名已被占用')
          resolve()
        })
      })
    } catch (err) {
      return res.cc(err)
    }
    //2.如果没有被占用，获取admin表的admin_id的最大值
    let admin_id = ''
    try {
      await new Promise((resolve, reject) => {
        const sqlB = 'select max(admin_id) as maxId from admin'
        db.query(sqlB, (err, results) => {
          if (err) reject(err)
          admin_id = results[0].maxId + 1
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    // console.log(userinfo)
    // 3.对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    //4.将数据写入admin表admin_id值为admin_id+1
    try {
      await new Promise((resolve, reject) => {
        const sqlC = 'insert into admin set ?'
        db.query(sqlC, { username: userinfo.username, password: userinfo.password, admin_id }, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('注册失败')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //5.获取adminInfo1表的roles_id的最大值
    let roles_id = ''
    try {
      await new Promise((resolve, reject) => {
        const sqlD = 'select max(roles_id) as maxId from adminInfo1'
        db.query(sqlD, (err, results) => {
          if (err) reject(err)
          roles_id = results[0].maxId + 1
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //6 .获取现在时间格式为yy-mm-dd-hh--mm-ss
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    //7.将数据写入adminInfo1表
    try {
      await new Promise((resolve, reject) => {
        const sqlD = 'insert into adminInfo1 set ?'
        db.query(sqlD, { admin_id, createTime: time, updateTime: time, roles_id, name: userinfo.username,email:userinfo.email }, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('注册失败')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    localStorage.removeItem(userinfo.email)
    res.cc('注册成功', 200)
    //执行sql语句
  } else {
    res.json({
      code: 205,
      message: '注册码错误',
    })
  }
}
//发送验证码接口
exports.sendCode = (req, res) => {
  //保存验证码和邮箱，时间
  let user = {}
  let email = req.body.email
  if (!email) return res.cc('请输入邮箱。')
  let code = createSixNum()
  let time = new Date().getTime()
  user.code = code
  user.time = time
  user.email = email
  user = JSON.stringify(user)
  // 放入缓存中
  localStorage.setItem(email, user)
  let sql = `select * from adminInfo1 where email= "${email}"`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) {
      res.json({
        code: 205,
        message: '邮箱已被绑定',
      })
    } else {
      var mail = {
        // 发件人
        from: '<969060742@qq.com>',
        // 主题
        subject: '验证码', //邮箱主题
        // 收件人
        to: email, //前台传过来的邮箱
        // 邮件内容，HTML格式
        text: '请在五分钟内使用' + code + '作为你的验证码', //发送验证码
      }
      maileConfig(mail)
      res.json({
        code: 200,
        message: '发送成功',
      })
    }
  })

  // 随机产生六位验证码
  function createSixNum() {
    var Num = ''
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10)
    }
    return Num
  }
}

//登录接口
exports.login = (req, res) => {
  const userinfo = req.body
  const sql = 'select * from account where phone=?'

  db.query(sql, userinfo.phone, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('无匹配账号')
    //TODO 判断密码是否一致
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if (!compareResult) return res.cc('密码错误')
    //TODO:在服务器生成Token的字符串
    const user = { ...results[0], password: '' } //...为展开运算符 后面是把对象的属性覆盖
    //对用户的信息进行加密 生成Token
    //三个参数:  加密对象  解密字符串 有效时长

    const tokenStr = jwt.sign(user, config.token.jwtSecretKey, { expiresIn: config.token.expiresIn })
    res.json({
      code: 200,
      message: '登录成功',
      token: 'Bearer ' + tokenStr, //Bearer 客户端使用需要加上 这边帮忙加上
    })
  })
}
