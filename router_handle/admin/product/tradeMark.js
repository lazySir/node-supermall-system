const db=require('../../../db')
//查
exports.getBrandList=(req,res)=>{
  let { page, limit } = req.params
  //先返回所有的记录数
  //count 函数 可以计算获取的条数
  const sql = 'select count(*) as total from tradeMark '
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results == null) return res.cc('无记录')
    //results[0]代表的就是total 总共条数
    const total = results[0]['total']
    //3.查询记录
    //limit x,x ：  limit 3，5 表示从第三条数据开始往后面获取五条数据  4，5，6，7，8
    //所以先计算出起始位置
    page = (page - 1) * limit
    const sqlA = `select * from tradeMark limit ${page},${limit}  `
    db.query(sqlA, (err, results1) => {
      if (err) return res.cc(err)
      //results1就是获取到的数据
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

//增
exports.addBrand=(req,res)=>{
    //1.获取前端发送过来的数据
    const dataInfo = req.body
    //2.sql语句
    const sql = 'insert into tradeMark set?'
  
    db.query(sql, {  LOGO: dataInfo.LOGO, name: dataInfo.name }, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows != 1) return res.cc('添加数据失败')
      res.json({
        code: 200,
        message: '添加数据成功',
      })
    })
}

//更
exports.updateBrand=(req,res)=>{
    //获取前端发送过来的数据
    const dataInfo = req.body
    //根据id和username修改数据
    const sql = `update tradeMark set name="${dataInfo.name}" ,LOGO="${dataInfo.LOGO}" where id="${dataInfo.id}"  `
    db.query(sql, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('修改数据失败')
      return res.cc('修改数据成功', 200)
    })
}

//删
exports.deleteBrand=(req,res)=>{
  const pswID = req.params.id
  const sql = `delete from tradeMark where id=?`
  db.query(sql, pswID, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除数据失败')
    return res.cc('删除数据成功', 200)
  })
}