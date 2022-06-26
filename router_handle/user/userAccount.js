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
exports.register = (req, res) => {
  //获取客户端提交到服务器的用户信息
  const userinfo = req.body
  console.log(userinfo)
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
  }
  //如果验证码未过期  且验证码正确
  if (userCodeInfo.code === userinfo.code) {
    //定义sql语句查询用户名是否被占用
    const sqlStr = 'select * from account where phone=?'
    db.query(sqlStr, userinfo.phone, (err, results) => {
      //如果执行sql语句失败
      if (err) {
        return res.cc(err)
      }
      //如果用户名被占用
      if (results.length > 0) {
        return res.cc('手机号码已被注册')
      }
      //TODO:如果成功 则开始注册
      userinfo.password = bcrypt.hashSync(userinfo.password, 10)
      //数据库语句 ：注册账号列表
      const sql = `insert into account set?`
      db.query(
        sql,
        {
          phone: userinfo.phone,
          password: userinfo.password,
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
      //数据库语句：写入用户信息列表
      const sql1 = `insert into userinfo set?`
      db.query(sql1, { phone: userinfo.phone, email: userinfo.email }, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('注册用户失败')
      })
      // 注册成功删除缓存
      localStorage.removeItem(userinfo.email)
      res.cc('注册成功', 200)
    })
  } else {
    //未过期但是验证码错误
    res.send({
      code: 205,
      message: '验证码输入错误，请重新输入',
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
  let sql = `select * from userinfo where email= "${email}"`
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

    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    res.json({
      code: 200,
      message: '登录成功',
      token: 'Bearer ' + tokenStr, //Bearer 客户端使用需要加上 这边帮忙加上
    })
  })
}
