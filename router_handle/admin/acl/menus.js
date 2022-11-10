const db = require('../../../db')
// 获取所有权限菜单列表
exports.getAll = async (req, res) => {
  let aclMenus1 = ''
  let aclMenus2 = ''
  let aclMenus3 = ''
  try {
    aclMenus1 = await new Promise((resolve, reject) => {
      const sql = `select * from aclMenus1`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('查询aclMenus1表失败')
        resolve(results)
      })
    })
  } catch (error) {
    res.cc(error)
  }
  try {
    aclMenus2 = await new Promise((resolve, reject) => {
      const sql = `select * from aclMenus2`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('查询aclMenus2表失败')
        resolve(results)
      })
    })
  } catch (error) {
    res.cc(error)
  }
  try {
    aclMenus3 = await new Promise((resolve, reject) => {
      const sql = `select * from aclMenus3`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('查询aclMenus3表失败')
        resolve(results)
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //将aclMenus1和aclMenus2和aclMenus3中isDelete属性为1的删掉
  aclMenus1 = aclMenus1.filter((item) => item.isDelete == 0)
  aclMenus2 = aclMenus2.filter((item) => item.isDelete == 0)
  aclMenus3 = aclMenus3.filter((item) => item.isDelete == 0)
  aclMenus1 = aclMenus1.map((c1, i) => {
    c1.children = aclMenus2
      .filter((c2) => {
        if (c1.type_id == c2.parent_id) {
          return true
        }
      })
      .map((c2, j) => {
        c2.children = aclMenus3
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
    message: '获取菜单权限列表成功',
    data: aclMenus1,
  })
}
// 添加权限菜单
exports.add = async (req, res) => {
  const { level } = req.body
  let totalMenus1 = ''
  let totalMenus2 = ''
  let totalMenus3 = ''
  //如果level等于1说明添加的是一级菜单
  if (level == 1) {
    //1.查询menus1表中acl_id的最大值
    try {
      totalMenus1 = await new Promise((resolve, reject) => {
        const sql = `select max(acl_id) from aclMenus1`
        db.query(sql, (err, results) => {
          if (err) reject(err)
          if (results.length < 1) reject('查询aclMenus1表失败')
          resolve(results[0]['max(acl_id)'])
        })
      })
    } catch (error) {
      res.cc(error)
    }

    //2.根据aclKey查询menus1表中是否有重复的数据
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from aclMenus1 where aclKey=?`
        db.query(sql, [req.body.aclKey], (err, results) => {
          if (err) reject(err)
          if (results.length > 0) reject('该权限已存在')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //3.如果没有重复就将totalMenus1+1作为type_id以及req.body的数据存入menus1表中
    try {
      await new Promise((resolve, reject) => {
        const sql = `insert into aclMenus1 set ?`
        db.query(sql, { ...req.body, acl_id: totalMenus1 + 1, type_id: totalMenus1 + 1 }, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('添加一级菜单失败')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //4.如果添加成功就返回成功信息
    res.json({
      code: 200,
      message: '添加一级菜单成功',
      data: null,
    })
  }
  //如果level等于2说明添加的是二级菜单
  else if (level == 2) {
    //1.查询menus2表中acl_id的最大值
    try {
      totalMenus2 = await new Promise((resolve, reject) => {
        const sql = `select max(acl_id)  from aclMenus2`
        db.query(sql, (err, results) => {
          if (err) reject(err)
          if (results.length < 1) reject('查询aclMenus2表失败')
          resolve(results[0]['max(acl_id)'])
        })
      })
    } catch (error) {
      res.cc(error)
    }
    //2.根据type_id为parent_id的aclKey查询aclMenus2的表是否有重复数据
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from aclMenus2 where parent_id=? and aclKey=?`
        db.query(sql, [req.body.type_id, req.body.aclKey], (err, results) => {
          if (err) reject(err)
          if (results.length > 0) reject('该权限已存在')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //3.如果没有重复数据将type_id作为parent_id以及totalMenus2+1作为type_id以及req.body的数据存入aclMenus2表中
    try {
      await new Promise((resolve, reject) => {
        const sql = `insert into aclMenus2 set ?`
        db.query(sql, { ...req.body, acl_id: totalMenus2 + 1, parent_id: req.body.type_id, type_id: totalMenus2 + 1 }, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('添加二级菜单失败')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //4.如果添加成功就返回成功信息
    res.json({
      code: 200,
      message: '添加二级菜单成功',
      data: null,
    })
  }
  //如果level等于3说明添加的是三级菜单
  else if (level == 3) {
    //0.获取menus3表中acl_id的最大值
    try {
      totalMenus3 = await new Promise((resolve, reject) => {
        const sql = `select max(acl_id)  from aclMenus3`
        db.query(sql, (err, results) => {
          if (err) reject(err)
          if (results.length < 1) reject('查询aclMenus3表失败')
          resolve(results[0]['max(acl_id)'])
        })
      })
    } catch (error) {
      res.cc(error)
    }
    //1.根据type_id为parent_id的aclKey查询aclMenus3的表是否有重复数据
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from aclMenus3 where parent_id=? and aclKey=?`
        db.query(sql, [req.body.type_id, req.body.aclKey], (err, results) => {
          if (err) reject(err)
          if (results.length > 0) reject('该权限已存在')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //2.如果没有重复数据将type_id作为parent_id以及req.body的数据存入aclMenus3表中 aclMenus3表中无type_id属性
    try {
      await new Promise((resolve, reject) => {
        const sql = `insert into aclMenus3 set ?`
        const dataInfo = { ...req.body }
        delete dataInfo.type_id
        db.query(sql, { ...dataInfo, acl_id: totalMenus3 + 1, parent_id: req.body.type_id }, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('添加三级菜单失败')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //3.如果添加成功就返回成功信息
    res.json({
      code: 200,
      message: '添加三级菜单成功',
      data: null,
    })
  }
}
//更新二三级菜单
exports.update = async (req, res) => {
  //1.获取level 根据level判断是更新一级菜单还是二级菜单还是三级菜单
  const level = req.body.level
  //如果level等于2说明更新的是二级菜单
  if (level == 2) {
    //1.根据parent_id和aclValue查询aclMenus2的表是否有重复数据
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from aclMenus2 where parent_id=? and aclValue=?`
        db.query(sql, [req.body.parent_id, req.body.aclValue], (err, results) => {
          if (err) reject(err)
          if (results.length > 0) reject('该权限已存在')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //2.如果没有重复数据就根据id更新aclKey和aclValue值
    try {
      await new Promise((resolve, reject) => {
        const sql = `update aclMenus2 set aclKey=?,aclValue=? where id=?`
        db.query(sql, [req.body.aclKey, req.body.aclValue, req.body.id], (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('更新二级菜单失败')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //3.如果更新成功就返回成功信息
    res.json({
      code: 200,
      message: '更新二级菜单成功',
      data: null,
    })
  }
  //如果level等于3说明更新的是三级菜单
  else if (level == 3) {
    //1.根据parent_id和aclKey查询aclMenus3的表是否有重复数据
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from aclMenus3 where parent_id=? and aclKey=?`
        db.query(sql, [req.body.parent_id, req.body.aclKey], (err, results) => {
          if (err) reject(err)
          if (results.length > 0) reject('该权限已存在')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //2.如果没有重复数据就根据id更新aclKey和aclValue值
    try {
      await new Promise((resolve, reject) => {
        const sql = `update aclMenus3 set aclKey=?,aclValue=? where id=?`
        db.query(sql, [req.body.aclKey, req.body.aclValue, req.body.id], (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('更新三级菜单失败')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //3.如果更新成功就返回成功信息
    res.json({
      code: 200,
      message: '更新三级菜单成功',
      data: null,
    })
  }
}
//删除菜单
exports.delete = async (req, res) => {
  //1.从params获取level和id
  const { level, id } = req.params
  //bug修复删除了菜单但是roleAcl表中却还残留这个权限
  //2.根据level判断是删除二级菜单还是三级菜单
  if (level == 2) {
    //1.根据id获取对应的acl_id
    let acl_id = ''
    try {
      await new Promise((resolve, reject) => {
        const sql = `select acl_id from aclMenus2 where id=?`
        db.query(sql, [id], (err, results) => {
          if (err) reject(err)
          if (results[0].acl_id) {
            acl_id = results[0].acl_id
          }
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //2.删除roleAcl中acl_id为acl_id的数据
    try {
      await new Promise((resolve, reject) => {
        const sql = `delete from roleAcl where acl_id=?`
        db.query(sql, [acl_id], (err, results) => {
          if (err) reject(err)
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //根据id删除二级菜单
    try {
      await new Promise((resolve, reject) => {
        const sql = `delete from aclMenus2 where id=?`
        db.query(sql, id, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('删除二级菜单失败')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
  }
  //三级菜单
  else if (level == 3) {
    //1.根据id获取对应的acl_id
    let acl_id = ''
    try {
      await new Promise((resolve, reject) => {
        const sql = `select acl_id from aclMenus3 where id=?`
        db.query(sql, [id], (err, results) => {
          if (err) reject(err)
          if (results[0].acl_id) {
            acl_id = results[0].acl_id
          }
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //2.删除roleAcl中acl_id为acl_id的数据
    try {
      await new Promise((resolve, reject) => {
        const sql = `delete from roleAcl where acl_id=?`
        db.query(sql, [acl_id], (err, results) => {
          if (err) reject(err)
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //根据id删除三级菜单
    try {
      await new Promise((resolve, reject) => {
        const sql = `delete from aclMenus3 where id=?`
        db.query(sql, id, (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('删除三级菜单失败')
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
  }
  //3.如果删除成功就返回成功信息
  res.json({
    code: 200,
    message: '删除菜单成功',
    data: null,
  })
}
