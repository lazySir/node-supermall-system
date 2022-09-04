const db = require('../../../db')

//获取平台属性接口函数
exports.getListById = async (req, res) => {
  //获取分类id
  const { category1Id, category2Id, category3Id } = req.params
  const sql = `select * from attr where category1Id=${category1Id} and category2Id=${category2Id} and category3Id=${category3Id}`
  //获取平台属性名字
  let attr = await new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return res.cc(err)
      if (results == null) return res.cc('faile')
      const attr = results.map((item) => {
        return item
      })
      //将attr返回
      resolve(attr)
    })
  })
  //设计一个方法将平台属性添加一个属性列表数组
  function addValueList(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      attr[i].attrValueList = []
    }
    //将2的数组和1的数据进行合并
    for (let j = 0; j < arr1.length; j++) {
      for (let x = 0; x < arr2.length; x++)
        if (arr1[j].id == arr2[x].attrId) {
          arr1[j].attrValueList.push(arr2[x])
        }
    }
    return arr1
  }

  const sql1 = `select * from attrValue`
  let attrValue = await new Promise((resolve, reject) => {
    db.query(sql1, (err, results) => {
      if (err) return res.cc(err)
      if (results == null) return res.cc('faile')
      resolve(results)
    })
  })
  attr = addValueList(attr, attrValue)
  res.json({
    code: 200,
    message: '成功',
    data: attr,
  })
}
//新增属性值
exports.add = (req, res) => {
  //1.解构出前端传过来的数据
  let { category1Id, category2Id, category3Id, attr_name, attrValueList } = req.body
  //2.检测属性名是否重复
  const sql = `select * from attr where attr_name='${attr_name}' and category1Id=${category1Id} and category2Id=${category2Id} and category3Id=${category3Id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length > 0) return res.cc('属性名重复')
    //3.计算属性名的总个数(要计算id)
    const sqlA = `select count(*) as total from attr `
    db.query(sqlA, (err, results) => {
      if (err) return res.cc(err)
      //results[0]代表的就是total 总共条数
      let total = results[0]['total']
      //4.添加属性值
      const sqlB = `insert into attr set ?`
      db.query(sqlB, { id: total + 1, category1Id, category2Id, category3Id, attr_name }, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('添加属性名失败')
        //5.添加属性值
        const sqlC = `insert into attrValue set ?`
        for (let i = 0; i < attrValueList.length; i++) {
          db.query(sqlC, { attrId: total + 1, valueName: attrValueList[i].valueName }, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('添加属性值失败')
          })
        }
        res.json({
          code: 200,
          message: '更新成功！',
        })
      })
    })
  })
}

//更新属性
exports.update = (req, res) => {
  //1.解构出前端传过来的数据
  let { id, attr_name, attrValueList } = req.body
  //2.更新属性名
  const sqlA = `update attr set attr_name='${attr_name}' where id=${id}`
  db.query(sqlA, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新属性名失败')
    //3.更新属性值
    //3.1将attrValueList拆分成两个数组 一个增加一个修改
    let addAttrValueList = []
    let updateAttrValueList = []

    attrValueList.forEach((item) => {
      //如果存在id则说明是要修改数据
      if (item.id) {
        updateAttrValueList.push(item)
      } else {
        //则说明是要新增的数据
        addAttrValueList.push(item)
      }
    })
    //4.修改属性值
    const sqlB = `update attrValue set valueName=? where id=?`
    for (let i = 0; i < updateAttrValueList.length; i++) {
      db.query(sqlB, [updateAttrValueList[i].valueName, updateAttrValueList[i].id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新属性值失败')
      })
    }
    //5.新增属性值
    const sqlC = `insert into attrValue set ?`
    for (let i = 0; i < addAttrValueList.length; i++) {
      db.query(sqlC, { attrId: id, valueName: addAttrValueList[i].valueName }, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('新增属性值失败')
      })
    }
    res.json({
      code: 200,
      message: '更新成功',
    })
  })
}
//删除属性
exports.delete = (req, res) => {
  //解构出id
  const { Id } = req.params
  //删除属性
  const sqlA = `delete from attr where id=${Id}`
  db.query(sqlA, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除属性失败')
    //删除属性值
    const sqlB = `delete from attrValue where attrId=${Id}`
    db.query(sqlB, (err, results) => {
      if (err) return res.cc(err)
      res.json({
        code: 200,
        message: '删除成功',
      })
    })
  })
}





//获取平台属性接口函数
exports.getListByName = async (req, res) => {
  //获取分类id
  const { searchName } = req.params
  const sql = `select * from attr where attr_name like '%${searchName}%'`
  //获取平台属性名字
  let attr = await new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return res.cc(err)
      if (results == null) return res.cc('无记录')
      const attr = results.map((item) => {
        return item
      })
      //将attr返回
      resolve(attr)
    })
  })
  //设计一个方法将平台属性添加一个属性列表数组
  function addValueList(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      attr[i].attrValueList = []
    }
    //将2的数组和1的数据进行合并
    for (let j = 0; j < arr1.length; j++) {
      for (let x = 0; x < arr2.length; x++)
        if (arr1[j].id == arr2[x].attrId) {
          arr1[j].attrValueList.push(arr2[x])
        }
    }
    return arr1
  }

  const sql1 = `select * from attrValue`
  let attrValue = await new Promise((resolve, reject) => {
    db.query(sql1, (err, results) => {
      if (err) return res.cc(err)
      if (results == null) return res.cc('faile')
      resolve(results)
    })
  })
  attr = addValueList(attr, attrValue)
  res.json({
    code: 200,
    message: '成功',
    data: attr,
  })
}