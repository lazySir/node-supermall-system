//导入数据库操作模块
const db = require('../../db/index')

exports.getAllGoodsCategory = async (req, res) => {
  //将一级分类数据加入category
  let c1 = await new Promise((resolve, reject) => {
    const sql = `select * from goodsCategory1`
    db.query(sql, (error, results) => {
      if (error) return res.cc(error)
      if (results == null) return res.cc('faile')
      let category1 = results.map((item) => {
        delete item.is_delete
        return item
      })
      resolve(category1)
    })
  })
  //获取二级分类
  let c2 = await new Promise((resolve, reject) => {
    const sql = `select * from goodsCategory2`
    db.query(sql, (error, results) => {
      if (error) return res.cc(error)
      if (results == null) return res.cc('faile')
      let category2 = results.map((item) => {
        delete item.is_delete
        return item
      })
      resolve(category2)
    })
  })
  //获取三级分类
  let c3 = await new Promise((resolve, reject) => {
    const sql = `select * from goodsCategory3`
    db.query(sql, (error, results) => {
      if (error) return res.cc(error)
      if (results == null) return res.cc('faile')
      let category3 = results.map((item) => {
        delete item.is_delete
        return item
      })
      resolve(category3)
    })
  })
  //设计一个方法将两个分类整合成一个
  function copy(arr1,arr2){
    //先将1的每一个数组元素添加一个数组
    let i=0
    for(i;i<arr1.length;i++){
      arr1[i].child=[]
    }
    //将2的数组和1的数据进行合并
    for(let j=0;j<arr1.length;j++){
      for(let x=0;x<arr2.length;x++)
      if(arr1[j].type_id==arr2[x].parent_id){
        arr1[j].child.push(arr2[x])
      }
    }
    return arr1
  }
  c2=copy(c2,c3)
  c1=copy(c1,c2)
  res.json({
    "code":200,
    "message":"成功",
    "data":c1
  })
}
