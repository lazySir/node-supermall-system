const db = require('../../db')

//获取平台属性接口函数
exports.getAttrInfoList = async (req, res) => {
  //获取分类id
  const { category1Id, category2Id, category3Id } = req.params
  const sql = `select * from attr where category1Id=${category1Id} and category2Id=${category2Id} and category3Id=${category3Id}`
  //获取平台属性名字
  let attr = await new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return res.cc(err)
      if (results == null) return res.cc('faile')
      const attr = results.map((item) => {
        delete item.category1Id
        delete item.category2Id
        delete item.category3Id
        return item
      })
      //将attr返回
      resolve(attr)
    })
  })
  //设计一个方法将平台属性添加一个属性列表数组
  function addValueList(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      attr[i].valueList = []
    }
    //将2的数组和1的数据进行合并
    for (let j = 0; j < arr1.length; j++) {
      for (let x = 0; x < arr2.length; x++)
        if (arr1[j].id == arr2[x].attrId) {
          arr1[j].valueList.push(arr2[x])
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
  attr = addValueList(attr,attrValue)
  res.json({
    "code":200,
    "message":"成功",
    "data":attr
  })
}
//新增属性值
exports.saveAttrInfo = (req,res)=>{
  res.send('ok!')
}