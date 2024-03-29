const db = require('../../../db')
//  用来加密数据
const CryptoJS = require('crypto-js')

const config = require('../../../config')
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
      //results1就是获取到的数据
      //遍历results1
      results1.forEach((item) => {
        //遍历results1的对象属性
        for(let key in item){
          if(key!="id"&&key!='username')
          item[key] = CryptoJS.AES.decrypt(item[key], config.pswStore.key).toString(CryptoJS.enc.Utf8)
        }
      })
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
  //1.获取前端发送过来的数据
  const dataInfo = req.body
  //2.根据token获取username
  const { username } = req.user
  //3.对要添加的数据进行加密
  //3.1遍历对象
  for (let key of Object.keys(dataInfo)) {
    if (dataInfo[key]) dataInfo[key] = CryptoJS.AES.encrypt(dataInfo[key], config.pswStore.key).toString()
  }
  //4..sql语句
  const sql = 'insert into passwordManager set?'

  db.query(sql, { username: username, LOGO: dataInfo.LOGO, account: dataInfo.account, password: dataInfo.password, name: dataInfo.name }, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows != 1) return res.cc('添加数据失败')
    res.json({
      code: 200,
      message: '添加数据成功',
    })
  })
}
//修改数据
exports.updatePswManager = (req, res) => {
  //获取前端发送过来的数据
  const dataInfo = req.body
  //保险起见还是获取token里的username
  const { username } = req.user


  //进行数据加密
  // for (let key of Object.keys(dataInfo)) {
  //   if (dataInfo[key]) dataInfo[key] = CryptoJS.AES.encrypt(dataInfo[key], config.pswStore.key).toString()
  // }
  for(let item in dataInfo){
    if(item!="id"){
      dataInfo[item] = CryptoJS.AES.encrypt(dataInfo[item], config.pswStore.key).toString()
    }
  }

  //根据id和username修改数据
  const sql = `update passwordManager set name="${dataInfo.name}",password="${dataInfo.password}",account="${dataInfo.account}" ,LOGO="${dataInfo.LOGO}" where id="${dataInfo.id}"  `
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('修改数据失败')
    return res.cc('修改数据成功', 200)
  })
}
//删除数据
exports.deletePswManager = (req, res) => {
  const pswID = req.params.id
  const sql = `delete from passwordManager where id=?`
  db.query(sql, pswID, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除数据失败')
    return res.cc('删除数据成功', 200)
  })
}
