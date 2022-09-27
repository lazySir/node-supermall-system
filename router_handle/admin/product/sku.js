const db = require('../../../db')
//获取所有sku列表
exports.getSkuList = async (req, res) => {
  let { page, limit } = req.params
  page = page < 1 ? 1 : page
  page = (page - 1) * limit
  let resultsSku = ''
  let resultsSale = ''
  let resultsImg = ''
  let resultsAttr = ''
  let resultsDefault = ''
  let total = 0
  //查询总条数
  try {
    await new Promise((resolve, reject) => {
      const sql = 'select count(*) as total from sku '
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results == null) reject('无记录')
        //results[0]代表的就是total 总共条数
        total = results[0]['total']
        resolve()
      })
    })
  } catch (error) {
    res.cc(error)
  }
  if(total==0){
    res.json({
      code:200,
      message:'sku表无记录'
    })
  }
  //查询sku表
  try {
    resultsSku = await new Promise((resolve, reject) => {
      const sql = `select * from sku limit ${page},${limit}`
      db.query(sql, (err, results) => {
        if (err) return reject(err)
        if (results.affectedRows < 1) reject('sku表无数据')
        resolve(results)
      })
    })
  } catch (error) {
    res.cc(error)
  }

  //查询sku对应的attr
  try {
    await new Promise((resolve, reject) => {
      const sql = `select * from sku_attr `
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('无attr数据')
        resultsAttr = results
        resolve()
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //查询sku对应的sale
  try {
    await new Promise((resolve, reject) => {
      const sql = `select * from sku_sale `
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('无sale数据')
        resultsSale = results
        resolve()
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //查询sku对应的img
  //查询sku对应的attr
  try {
    await new Promise((resolve, reject) => {
      const sql = `select * from sku_img `
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('无img数据')
        resultsImg = results
        resolve()
      })
    })
  } catch (error) {
    res.cc(error)
  }

  try {
    await new Promise((resolve, reject) => {
      const sql = `select sku_img_url,sku_img_id from sku_img where isDefault=1`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('无img数据')
        resultsDefault = results
        resolve()
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //初始化resultsSku
  resultsSku.forEach((item) => {
    item.sale = []
    item.attr = []
    item.img = []
    item.Default = ''
  })
  //将sale添加进sku
  for (let i = 0; i < resultsSku.length; i++) {
    for (let j = 0; j < resultsSale.length; j++) {
      if (resultsSku[i].sku_sale_id == resultsSale[j].sku_sale_id) {
        resultsSku[i].sale.push(resultsSale[j])
      }
    }
  }
  //将attr添加进sku
  for (let i = 0; i < resultsSku.length; i++) {
    for (let j = 0; j < resultsAttr.length; j++) {
      if (resultsSku[i].sku_attr_id == resultsAttr[j].sku_attr_id) {
        resultsSku[i].attr.push(resultsAttr[j])
      }
    }
  }
  //将img添加进sku
  for (let i = 0; i < resultsSku.length; i++) {
    for (let j = 0; j < resultsImg.length; j++) {
      if (resultsSku[i].sku_img_id == resultsImg[j].sku_img_id) {
        resultsSku[i].img.push(resultsImg[j])
      }
    }
  }
  //将Default添加进sku
  for (let i = 0; i < resultsSku.length; i++) {
    for (let j = 0; j < resultsDefault.length; j++) {
      if (resultsSku[i].sku_img_id == resultsDefault[j].sku_img_id) {
        resultsSku[i].Default = resultsDefault[j].sku_img_url
      }
    }
  }

  res.json({
    code: 200,
    message: '获取数据成功',
    data: {
      records: resultsSku,
      total: total,
    },
  })
}

exports.getSkuById = async (req, res) => {
  let id = req.params.id
  let resultsSku = ''
  let resultsSale = []
  let resultsImg = []
  let resultsAttr = []
  let resultsDefault = ''
  //查询sku表
  try {
    resultsSku = await new Promise((resolve, reject) => {
      const sql = `select * from sku where id=?`
      db.query(sql, id, (err, results) => {
        if (err) return reject(err)
        if (results.affectedRows < 1) reject('sku表无数据')
        resolve(results)
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //查询sku对应的attr
  try {
    await new Promise((resolve, reject) => {
      const sql = `select * from sku_attr `
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('无attr数据')
        resultsAttr = results
        resolve()
      })
    })
  } catch (error) {
    res.cc(error)
  }
  console.log(resultsAttr)
  //查询sku对应的sale
  try {
    await new Promise((resolve, reject) => {
      const sql = `select * from sku_sale `
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('无sale数据')
        resultsSale = results
        resolve()
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //查询sku对应的img
  try {
    await new Promise((resolve, reject) => {
      const sql = `select * from sku_img `
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('无img数据')
        resultsImg = results
        resolve()
      })
    })
  } catch (error) {
    res.cc(error)
  }
  try {
    await new Promise((resolve, reject) => {
      const sql = `select sku_img_url,sku_img_id from sku_img where isDefault=1`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('无img数据')
        resultsDefault = results
        resolve()
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //初始化resultsSku
  resultsSku.forEach((item) => {
    item.sale = []
    item.attr = []
    item.img = []
    item.Default = ''
  })
  //将sale添加进sku
  for (let i = 0; i < resultsSku.length; i++) {
    for (let j = 0; j < resultsSale.length; j++) {
      if (resultsSku[i].sku_sale_id == resultsSale[j].sku_sale_id) {
        resultsSku[i].sale.push(resultsSale[j])
      }
    }
  }
  //将attr添加进sku
  for (let i = 0; i < resultsSku.length; i++) {
    for (let j = 0; j < resultsAttr.length; j++) {
      if (resultsSku[i].sku_attr_id == resultsAttr[j].sku_attr_id) {
        resultsSku[i].attr.push(resultsAttr[j])
      }
    }
  }
  //将img添加进sku
  for (let i = 0; i < resultsSku.length; i++) {
    for (let j = 0; j < resultsImg.length; j++) {
      if (resultsSku[i].sku_img_id == resultsImg[j].sku_img_id) {
        resultsSku[i].img.push(resultsImg[j])
      }
    }
  }
  //将Default添加进sku
  for (let i = 0; i < resultsSku.length; i++) {
    for (let j = 0; j < resultsDefault.length; j++) {
      if (resultsSku[i].sku_img_id == resultsDefault[j].sku_img_id) {
        resultsSku[i].Default = resultsDefault[j].sku_img_url
      }
    }
  }
  res.json({
    code: 200,
    message: '获取数据成功',
    data: resultsSku,
  })
}

//上架
exports.shelves = (req, res) => {
  let id = req.params.id
  let sql = `update sku set isSale=1 where id=?`
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows < 1) return res.cc('上架失败')
    res.cc('上架成功', 200)
  })
}
//下架
exports.TheShelves = (req, res) => {
  let id = req.params.id
  let sql = `update sku set isSale=0 where id=?`
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows < 1) return res.cc('下架失败')
    res.cc('下架成功', 200)
  })
}

exports.deleteById = async (req, res) => {
  let resultsSku = ''
  const id = req.params.id
  //5.查询sku表
  try {
    resultsSku = await new Promise((resolve, reject) => {
      const sql = 'select * from sku where id=?'
      db.query(sql, id, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('查询sku表失败')
        resolve(results)
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //6.删除sku表
  try {
    await new Promise((resolve, reject) => {
      const sql = 'delete from sku where id=?'
      db.query(sql, id, (err, results) => {
        if (err) reject(err)
        if (results.affectedRows < 1) reject('删除sku表失败')
        resolve('ok')
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //7.删除sku_img表
  try {
    await new Promise((resolve, reject) => {
      const sql = 'delete from sku_img where sku_img_id=?'
      resultsSku.forEach((item) => {
        db.query(sql, item.sku_img_id, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows < 1) reject('删除sku_img表失败')
          resolve('ok')
        })
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //8.删除sku_sale表
  try {
    await new Promise((resolve, reject) => {
      const sql = 'delete from sku_sale where sku_sale_id=?'
      resultsSku.forEach((item) => {
        db.query(sql, item.sku_sale_id, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows < 1) reject('删除sku_sale表失败')
          resolve('ok')
        })
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //9.删除sku_attr表
  try {
    await new Promise((resolve, reject) => {
      const sql = 'delete from sku_attr where sku_attr_id=?'
      resultsSku.forEach((item) => {
        db.query(sql, item.sku_attr_id, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows < 1) reject('删除sku_attr表失败')
          resolve('ok')
        })
      })
    })
  } catch (error) {
    res.cc(error)
  }
  res.json({
    code: 200,
    message: '删除成功！',
  })
}
