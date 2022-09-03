const db = require('../../../db')

const query = async (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

//查
exports.getBrandList = (req, res) => {
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
exports.addBrand = (req, res) => {
  //1.获取前端发送过来的数据
  const dataInfo = req.body
  //2.sql语句
  const sql = `select * from tradeMark where category1Id="${dataInfo.category1Id}" and category2Id="${dataInfo.category2Id}" and category3Id="${dataInfo.category3Id}" and name="${dataInfo.name}"`
  db.query(sql, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    //如果品牌被占用
    if (results.length > 0) {
      return res.cc('该分类下已存在该品牌')
    } else {
      const sqlA = `insert into tradeMark  (category1Id,category2Id,category3Id,LOGO,name) values ('${dataInfo.category1Id}','${dataInfo.category2Id}','${dataInfo.category3Id}','${dataInfo.LOGO}','${dataInfo.name}')`
      db.query(sqlA, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('添加数据失败')
        res.json({
          code: 200,
          message: '添加数据成功',
        })
      })
    }
  })
}

//更
exports.updateBrand = (req, res) => {
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
exports.deleteBrand = (req, res) => {
  const pswID = req.params.id
  const sql = `delete from tradeMark where id=?`
  db.query(sql, pswID, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除数据失败')
    return res.cc('删除数据成功', 200)
  })
}
//根据id的查
exports.getBrandListById = async (req, res) => {
  let { page, limit } = req.params
  if (page == 0) {
    page = 1
  }
  let { category1Id, category2Id, category3Id } = req.body
  //先返回所有的记录数
  //count 函数 可以计算获取的条数
  const sql = `select count(*) as total from tradeMark where  category1Id="${category1Id}" and category2Id="${category2Id}" and category3Id="${category3Id}"`

  try {
    const results = await query(sql)

    if (results == null) return res.cc('无记录')
    //results[0]代表的就是total 总共条数
    const total = results[0]['total']
    //3.查询记录
    //limit x,x ：  limit 3，5 表示从第三条数据开始往后面获取五条数据  4，5，6，7，8
    //所以先计算出起始位置
    page = (page - 1) * limit
    const sqlA = `select * from tradeMark where category1Id="${category1Id}" and category2Id="${category2Id}" and category3Id="${category3Id}" limit ${page},${limit} `

    const results1 = await query(sqlA)
    //results1就是获取到的数据
    res.json({
      code: 200,
      message: '获取数据成功',
      data: {
        total,
        list: results1,
      },
    })
  } catch (error) {
    res.cc(error)
  }

  // db.query(sql, (err, results) => {
  //   if (err) return res.cc(err)
  //   if (results == null) return res.cc('无记录')
  //   //results[0]代表的就是total 总共条数
  //   const total = results[0]['total']
  //   //3.查询记录
  //   //limit x,x ：  limit 3，5 表示从第三条数据开始往后面获取五条数据  4，5，6，7，8
  //   //所以先计算出起始位置
  //   page = (page - 1) * limit
  //   const sqlA = `select * from tradeMark where category1Id="${category1Id}" and category2Id="${category2Id}" and category3Id="${category3Id}" limit ${page},${limit} `

  //   db.query(sqlA, (err, results1) => {
  //     if (err) return res.cc(err)
  //     //results1就是获取到的数据
  //     res.json({
  //       code: 200,
  //       message: '获取数据成功',
  //       data: {
  //         total,
  //         list: results1,
  //       },
  //     })
  //   })
  // })
}

exports.getBrandByName = async (req, res) => {
  let { page, limit, searchBrand } = req.params
  if (page == 0) {
    page = 1
  }
  //先返回所有的记录数
  //count 函数 可以计算获取的条数
  const sql = `select count(*) as total from tradeMark where  name like "%${searchBrand}%"`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results[0]['total'] == 0) return res.cc('无记录')
    //results[0]代表的就是total 总共条数
    const total = results[0]['total']
    //3.查询记录
    //limit x,x ：  limit 3，5 表示从第三条数据开始往后面获取五条数据  4，5，6，7，8
    //所以先计算出起始位置
    page = (page - 1) * limit
    const sqlA = `select * from tradeMark where name like "%${searchBrand}%" limit ${page},${limit} `
    db.query(sqlA, (err, results1) => {
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
