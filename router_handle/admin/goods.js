const db = require('../../db')

exports.getCategory1 = (req, res) => {
  //获取商品一级分类
  const sql = `select * from goodsCategory1`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results == null) return res.cc('faile')
    results = results.map((item) => {
      //删除是否已删除的属性
      delete item.is_delete
      return item
    })
    res.json({
      code: 200,
      message: '成功',
      data: results,
    })
  })
}

exports.getCategory2 = (req, res) => {
  //获取一级分类的id
  category1Id = req.params.category1Id
  //获取二级分类
  const sql = `select * from goodsCategory2 where parent_id=?`
  db.query(sql, category1Id, (err, results) => {
    if (err) return res.cc(err)
    if (results == null) return res.cc('无记录')
    results = results.map((item) => {
      delete item.is_delete
      return item
    })
    res.json({
      code: 200,
      message: '成功',
      data: results,
    })
  })
}
//商品三级分类
exports.getCategory3 = (req, res) => {
    //获取二级分类的id
    category2Id = req.params.category2Id
    //获取三级分类
  const sql = `select * from goodsCategory3 where parent_id=?`
  db.query(sql, category2Id, (err, results) => {
    if (err) return res.cc(err)
    if (results == null) return res.cc('faile')
    results = results.map((item) => {
      delete item.is_delete
      return item
    })
    res.json({
      code: 200,
      message: '成功',
      data: results,
    })
  })
}
