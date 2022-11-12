const db = require('../../../db')
//获取商品一级分类
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
//获取商品二级分类
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
//获取商品三级分类
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

//获取所有商品分类
exports.getAllCategory = async (req, res) => {
  let category1 = '',
    category2 = '',
    category3 = ''
  //获取一级分类
  category1 = await new Promise((resolve, reject) => {
    try {
      //sql语句
      const sql = `select * ,category1_name as name from goodsCategory1`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('一级分类无记录')
        resolve(results)
      })
    } catch (error) {
      reject(error)
    }
  })
  //获取二级分类
  category2 = await new Promise((resolve, reject) => {
    try {
      //sql语句
      const sql = `select *,category2_name as name from goodsCategory2`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('二级分类无记录')
        resolve(results)
      })
    } catch (error) {
      reject(error)
    }
  })

  //获取三级分类
  category3 = await new Promise((resolve, reject) => {
    try {
      //sql语句
      const sql = `select *,category3_name as name from goodsCategory3`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('三级分类无记录')
        resolve(results)
      })
    } catch (error) {
      reject(error)
    }
  })

  /* //设计一个m方法将两个数组合并 前为父 后为子
  const combine = (arry1, arry2) => {
    //1.首先先在父中加一个数组用于存放子
    arry1.forEach((item) => {
      item.children = []
    })
    //2.遍历父
    arry1.forEach((item) => {
      //3.遍历子
      arry2.forEach((itemC) => {
        //父与子是通过 type_id与parent_id关联的
        if (item.type_id == itemC.parent_id) {
          //将子放入父中
          item.children.push({ ...itemC, key: `${i++}` })
        }
      })
    })
  }
  combine(category2, category3)
  combine(category1, category2) */

  category1 = category1.map((c1, i) => {
    c1.children = category2
      .filter((c2) => {
        if (c1.type_id == c2.parent_id) {
          return true
        }
      })
      .map((c2, j) => {
        c2.children = category3
          .filter((c3) => {
            if (c2.type_id == c3.parent_id) {
              return true
            }
          })
          .map((c3, k) => {
            return { ...c3, key: `${i}_${j}_${k}` }
          })
        return { ...c2, key: `${i}_${j}` }
      })
    return { ...c1, key: `${i}` }
  })

  res.json({
    code: 200,
    message: '获取所有分类成功',
    data: category1,
  })
}
//添加商品分类
exports.addCategory = async (req, res) => {
  const categoryInfo = req.body
  //一级分类的type_id总数
  let category1_type_id = ''
  //二级分类的type_id总数
  let category2_type_id = ''
  // console.log(categoryInfo)
  // 判断要添加到几级分类数据表
  if (categoryInfo.level) {
    //添加的是二级分类
    if (categoryInfo.level == 2) {
      try {
        category2_type_id = await new Promise((resolve, reject) => {
          //sql语句
          const sql = `select max(type_id) as type_id from goodsCategory2`
          db.query(sql, (err, results) => {
            if (err) reject(err)
            if (results.length < 1) reject('二级分类无记录')
            resolve(results[0]['type_id'])
          })
        })
      } catch (error) {
        return res.cc(error)
      }
      //判断是否有重复数据
      try {
        await new Promise((resolve, reject) => {
          //sql语句
          const sql = `select * from goodsCategory2 where category2_name=?`
          db.query(sql, categoryInfo.name, (err, results) => {
            if (err) reject(err)
            if (results.length > 0) reject('二级分类已存在')
            resolve()
          })
        })
      } catch (error) {
        return res.cc(error)
      }
      //添加数据
      try {
        await new Promise((resolve, reject) => {
          const sql = `insert into goodsCategory2 set ?`
          db.query(sql, { parent_id: categoryInfo.parent_id, category2_name: categoryInfo.name, type_id: category2_type_id + 1 }, (err, results) => {
            if (err) reject(err)
            if (results.affectedRows !== 1) reject('添加二级分类失败')
            resolve()
          })
        })
      } catch (error) {
        return res.cc(error)
      }
      res.json({
        code: 200,
        message: '二级分类添加成功',
      })
    } //添加的是三级分类
    else {
      //判断是否有重复数据
      try {
        await new Promise((resolve, reject) => {
          //sql语句
          const sql = `select * from goodsCategory3 where category3_name=?`
          db.query(sql, categoryInfo.name, (err, results) => {
            if (err) reject(err)
            if (results.length > 0) reject('三级分类已存在')
            resolve()
          })
        })
      } catch (error) {
        return res.cc(error)
      }
      //添加数据
      try {
        await new Promise((resolve, reject) => {
          const sql = `insert into goodsCategory3 set ?`
          db.query(sql, { parent_id: categoryInfo.parent_id, category3_name: categoryInfo.name }, (err, results) => {
            if (err) reject(err)
            if (results.affectedRows !== 1) reject('添加三级分类失败')
            resolve()
          })
        })
      } catch (error) {
        return res.cc(error)
      }
      res.json({
        code: 200,
        message: '添加三级分类成功',
      })
    }
  } else {
    //一级分类数据表
    //首先获取type_id的最大值
    try {
      category1_type_id = await new Promise((resolve, reject) => {
        //sql语句
        const sql = `select max(type_id) as type_id from goodsCategory1`
        db.query(sql, (err, results) => {
          if (err) reject(err)
          if (results.length < 1) reject('一级分类无记录')
          resolve(results[0]['type_id'])
        })
      })
    } catch (error) {
      return res.cc(error)
    }

    //判断是否有重复数据
    try {
      await new Promise((resolve, reject) => {
        //sql语句
        const sql = `select * from goodsCategory1 where category1_name=?`
        db.query(sql, categoryInfo.name, (err, results) => {
          if (err) reject(err)
          if (results.length > 0) reject('一级分类已存在')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //添加数据
    try {
      await new Promise((resolve, reject) => {
        const sql = `insert into goodsCategory1 set ?`
        db.query(sql, { category1_name: categoryInfo.name, type_id: category1_type_id + 1 }, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('添加一级分类失败')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    res.json({
      code: 200,
      message: '添加一级分类成功',
    })
  }
}

//更新商品分类
exports.updateCategory = async (req, res) => {
  let categoryInfo = req.body
  const { level, name, id } = categoryInfo
  if (level == 1) {
    //查重
    try {
      await new Promise((resolve, reject) => {
        const sql = 'select * from goodsCategory1 where category1_name=?'
        db.query(sql, name, (error, results) => {
          if (error) reject(error)
          if (results.length > 0) reject('已存在此分类')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //修改goodsCategory1的数据根据id
    try {
      await new Promise((resolve, reject) => {
        const sql = 'update goodsCategory1 set category1_name=? where id=?'
        db.query(sql, [name, id], (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('修改一级分类失败')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    res.json({
      code: 200,
      message: '修改成功！',
    })
  } else if (level == 2) {
    //查重
    try {
      await new Promise((resolve, reject) => {
        const sql = 'select * from goodsCategory2 where category2_name=?'
        db.query(sql, name, (err, results) => {
          if (err) reject(err)
          if (results.length > 0) reject('已存在此分类')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //修改goodsCategory2的数据根据id
    try {
      await new Promise((resolve, reject) => {
        const sql = 'update goodsCategory2 set category2_name=? where id=?'
        db.query(sql, [name, id], (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('修改二级分类失败')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    res.json({
      code: 200,
      message: '修改成功！',
    })
  } else {
    //查重
    try {
      await new Promise((resolve, reject) => {
        const sql = 'select * from goodsCategory3 where category3_name=?'
        db.query(sql, name, (err, results) => {
          if (err) reject(err)
          if (results.length > 0) reject('已存在此分类')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //修改goodsCategory1的数据根据id
    try {
      await new Promise((resolve, reject) => {
        const sql = 'update goodsCategory3 set category3_name=? where id=?'
        db.query(sql, [name, id], (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('修改三级分类失败')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    res.json({
      code: 200,
      message: '修改成功！',
    })
  }
}

//删除商品分类
exports.deleteCategory=(req,res)=>{
    let categoryInfo=req.body
    const {level,id}=categoryInfo
    if(level==1){
        //删除goodsCategory1的数据根据id
        const sql='delete from goodsCategory1 where id=?'
        db.query(sql,id,(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1) return res.cc('删除一级分类失败')
            res.json({
                code:200,
                message:'删除一级分类成功'
            })
        })
    }else if(level==2){
        //删除goodsCategory2的数据根据id
        const sql='delete from goodsCategory2 where id=?'
        db.query(sql,id,(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1) return res.cc('删除二级分类失败')
            res.json({
                code:200,
                message:'删除二级分类成功'
            })
        })
    }else{
        //删除goodsCategory3的数据根据id
        const sql='delete from goodsCategory3 where id=?'
        db.query(sql,id,(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1) return res.cc('删除三级分类失败')
            res.json({
                code:200,
                message:'删除三级分类成功'
            })
        })
    }
}
