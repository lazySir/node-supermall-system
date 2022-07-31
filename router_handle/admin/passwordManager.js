const db = require('../../db')
//获取账号数据列表
exports.getPswManagerList = (req, res) => {
  let { page, limit } = req.params
  //先返回所有的记录数
  //1.先通过token获取username账户名称
  const { username } = req.user
  //2.通过username获取该账号下的所有账号密码
  //count 函数 可以计算获取的条数
  const sql = 'select count(*) as total from passwordManager where username=?'
  db.query(sql, username, (err, results) => {
    if (err) return res.cc(err)
    if (results == null) return res.cc('无记录')
    //results[0]代表的就是total 总共条数
    const total = results[0]['total']
    //3.查询记录
    //limit x,x ：  limit 3，5 表示从第三条数据开始往后面获取五条数据  4，5，6，7，8
    //所以先计算出起始位置
    page = (page - 1) * limit
    const sqlA = `select * from passwordManager where username=? limit ${page},${limit}  `
    db.query(sqlA, username, (err, results1) => {
      if (err) return res.cc(err)
      res.json({
        code: 200,
        message: '获取数据成功',
        data: {
          total,
          list: results1,
        },
      })
    })
  })
}
//增加数据
exports.addPswManager = (req, res) => {
  //获取前端发送过来的数据
  const dataInfo = req.body.pswForm
  //根据token获取username
  const { username } = req.user
  //sql语句
  const sql = 'insert into passwordManager set?'
  db.query(sql, { username: username,LOGO:dataInfo.LOGO, account: dataInfo.account, password: dataInfo.password, name: dataInfo.name },(err,results)=>{
    if (err) return res.cc(err)
    if (results.affectedRows != 1) return res.cc('添加数据失败')
    res.json({
      "code":200,
      "message":"添加数据成功",
    })

  })
}

