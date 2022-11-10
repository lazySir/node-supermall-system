const db = require('../../../db')

//获取角色列表
exports.get = async (req, res) => {
  const { limit, page } = req.params
  const offset = (page - 1) * limit
  let total = ''
  let list = ''
  //1.首先先获取role表的总条数
  try {
    total = await new Promise((resolve, reject) => {
      const sqlStr = `select * from role`
      db.query(sqlStr, (err, results) => {
        if (err) return reject(err)
        resolve(results.length)
      })
    })
  } catch (error) {
    return res.cc(error)
  }

  try {
    //1.根据分页参数查询数据
    await new Promise((resolve, reject) => {
      const sqlStr = `select * from role limit ${offset},${limit}`
      db.query(sqlStr, (err, results) => {
        if (err) return reject(err)
        if (results.length < 1) reject('没有角色数据')
        list = results
        resolve()
      })
    })
  } catch (error) {
    return res.cc(errors)
  }
  res.json({
    code: 200,
    message: '获取角色列表成功',
    data: {
      total: total,
      list: list,
    },
  })
}

//跟新角色名称
exports.updateName = async (req, res) => {
  const { id, name } = req.body
  //1.根据name查询role表是否有重复数据
  try {
    await new Promise((resolve, reject) => {
      const sqlStr = `select * from role where name='${name}'`
      db.query(sqlStr, (err, results) => {
        if (err) return reject(err)
        if (results.length > 0) return reject('角色名称已存在')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //2.如果没有重复则根据id修改name
  try {
    await new Promise((resolve, reject) => {
      const sqlStr = `update role set name='${name}' where id=${id}`
      db.query(sqlStr, (err, results) => {
        if (err) return reject(err)
        if (results.affectedRows !== 1) reject('更新角色名称失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  res.json({
    code: 200,
    message: '更新角色名称成功',
  })
}

//添加新角色
exports.add = async (req, res) => {
  const { name } = req.body
  let totalRole = ''
  //1.根据name查看role表是否有重复的名字
  try {
    await new Promise((resolve, reject) => {
      const sqlStr = `select * from role where name='${name}'`
      db.query(sqlStr, (err, results) => {
        if (err) return reject(err)
        if (results.length > 0) return reject('角色名称已存在')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //2.查询role表的role_id最大值
  try {
    await new Promise((resolve, reject) => {
      const sqlStr = `select max(role_id) as max from role`
      db.query(sqlStr, (err, results) => {
        if (err) return reject(err)
        totalRole = results[0].max
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //3.将totalRole+1作为role_id以及name存入role表
  try {
    await new Promise((resolve, reject) => {
      const sqlStr = `insert into role set ?`
      db.query(sqlStr, { role_id: totalRole + 1, name }, (err, results) => {
        if (err) return reject(err)
        if (results.affectedRows !== 1) return reject('添加角色失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  res.json({
    code: 200,
    message: '添加角色成功',
  })
}
//按照名字模糊查找role表
exports.search = async (req, res) => {
  const { name } = req.body
  let list = ''
  let total = ''
  try {
    await new Promise((resolve, reject) => {
      const sqlStr = `select * from role where name like '%${name}%'`
      db.query(sqlStr, (err, results) => {
        if (err) return reject(err)
        if (results.length < 1) return reject('没有角色数据')
        list = results
        total = results.length
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  res.json({
    code: 200,
    message: '查询角色成功',
    data: { list, total },
  })
}
//按照id获取权限值
exports.getAuth = async (req, res) => {
  const { id } = req.params
  let aclMenus1 = ''
  let aclMenus2 = ''
  let aclMenus3 = ''
  //1.获取aclMenus1
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
  //2.获取aclMenus2
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
  //3.获取aclMenus3
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
  //4.将aclMenus1和aclMenus2和aclMenus3中isDelete属性为1的删掉
  aclMenus1 = aclMenus1.filter((item) => item.isDelete == 0)
  aclMenus2 = aclMenus2.filter((item) => item.isDelete == 0)
  aclMenus3 = aclMenus3.filter((item) => item.isDelete == 0)
  //6.根据id获取role表中的role_id
  let role_id = ''
  try {
    role_id = await new Promise((resolve, reject) => {
      const sql = `select * from role where id = ${id}`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('查询role表失败')
        resolve(results[0].role_id)
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //7.根据role_id查询roleAcl表中所有关于该role_id的数据
  let roleAcl = ''
  try {
    roleAcl = await new Promise((resolve, reject) => {
      const sql = `select * from roleAcl where role_id = ${role_id}`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        resolve(results)
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //8.给aclMenus1，aclMenus2，aclMenus3添加isChecked为false
  aclMenus1.forEach((item) => {
    item.isChecked = false
  })
  aclMenus2.forEach((item) => {
    item.isChecked = false
  })
  aclMenus3.forEach((item) => {
    item.isChecked = false
  })
  if (roleAcl) {
    //9.acl_level代表几级菜单，1代表一级菜单，2代表二级菜单，3代表三级菜单在将cal_id分别与aclMenus1，aclMenus2，aclMenus3中的acl对比，如果相等则将对应的isCheck属性设置为true
    aclMenus1.forEach((item) => {
      roleAcl.forEach((item2) => {
        if (item.acl_id === item2.acl_id && item2.acl_level === 1) {
          item.isChecked = true
        }
      })
    })
    aclMenus2.forEach((item) => {
      roleAcl.forEach((item2) => {
        if (item.acl_id === item2.acl_id && item2.acl_level === 2) {
          item.isChecked = true
        }
      })
    })
    aclMenus3.forEach((item) => {
      roleAcl.forEach((item2) => {
        if (item.acl_id === item2.acl_id && item2.acl_level === 3) {
          item.isChecked = true
        }
      })
    })
  }
  //10.合并
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
    message: '获取数据成功',
    data: aclMenus1,
  })
}

//根据id修改权限值
exports.updateAuth = async (req, res) => {
  const { id } = req.params
  let aclKeys = req.body
  //0.根据id获取role表中的role_id
  let role_id = ''
  try {
    role_id = await new Promise((resolve, reject) => {
      const sql = `select * from role where id = ${id}`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('查询role表失败')
        resolve(results[0].role_id)
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //1.如果roleAcl表中存在role_id为role_id的数据则删除
  try {
    await new Promise((resolve, reject) => {
      const sql = `delete from roleAcl where role_id = ${role_id}`
      db.query(sql, (err, results) => {
        if (err) reject(err)
        resolve(results)
      })
    })
  } catch (error) {
    res.cc(error)
  }
  //2.如果aclKeys长度为0，则直接返回修改权限成功
  //3.aclKeys长度不为0
  if (aclKeys.length != 0) {
    let aclMenus1 = ''
    let aclMenus2 = ''
    let aclMenus3 = ''
    //4.获取aclMenus1，aclMenus2，aclMenus3
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
     return res.cc(error)
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
      return res.cc(error)
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
     return res.cc(error)
    }
    //5.给aclMenus1，aclMenus2，aclMenus3添加isChecked为false
    aclMenus1.forEach((item) => {
      item.isChecked = false
    })
    aclMenus2.forEach((item) => {
      item.isChecked = false
    })
    aclMenus3.forEach((item) => {
      item.isChecked = false
    })
    //6.遍历aclKeys，将aclMenus1，aclMenus2，aclMenus3中的aclKey与之比对如果相同则将isChecked改为true
    aclKeys.forEach((item) => {
      aclMenus1.forEach((item2) => {
        if (item == item2.aclKey) {
          item2.isChecked = true
        }
      })
      aclMenus2.forEach((item2) => {
        if (item == item2.aclKey) {
          item2.isChecked = true
        }
      })
      aclMenus3.forEach((item2) => {
        if (item == item2.aclKey) {
          item2.isChecked = true
        }
      })
    })
    //7.遍历aclMenus1，aclMenus2，aclMenus3，将isChecked为true的数据中的acl_level和acl_id插入roleAcl表且role_id为role_id
    aclMenus1.forEach((item) => {
      if (item.isChecked == true) {
        const sql = `insert into roleAcl set ?`
        db.query(sql, { role_id: role_id, acl_id: item.acl_id, acl_level: 1 }, (err, results) => {
          if (err) res.cc(err)
        })
      }
    })
    aclMenus2.forEach((item) => {
      if (item.isChecked == true) {
        const sql = `insert into roleAcl set ?`
        db.query(sql, { role_id: role_id, acl_id: item.acl_id, acl_level: 2 }, (err, results) => {
          if (err)  res.cc(err)
        })
      }
    })
    aclMenus3.forEach((item) => {
      if (item.isChecked == true) {
        const sql = `insert into roleAcl set ?`
        db.query(sql, { role_id: role_id, acl_id: item.acl_id, acl_level: 3 }, (err, results) => {
          if (err) res.cc(err)
        })
      }
    })
  }
  res.json({
    code: 200,
    message: '修改权限成功',
  })
}
//根据id删除角色
exports.deleteRole = async (req,res)=>{
  const {id} = req.params
  //1.根据id查询role表中对应的role_id和roles_id
  let role_id = ''
  let roles_id = ''
  try {
    role_id = await new Promise((resolve,reject)=>{
      const sql = `select role_id from role where id = ${id}`
      db.query(sql,(err,results)=>{
        if(err) reject(err)
        resolve(results[0].role_id)
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  try {
    roles_id = await new Promise((resolve,reject)=>{
      const sql = `select roles_id from roles where role_id = ${role_id}`
      db.query(sql,(err,results)=>{
        if(err) reject(err)
        resolve(results[0].roles_id)
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //2.j根据role_id删除roleAcl表中对应的数据
  try {
    await new Promise((resolve,reject)=>{
      const sql = `delete from roleAcl where role_id = ${role_id}`
      db.query(sql,(err,results)=>{
        if(err) reject(err)
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //3.根据id删除role表中对应的数据
  try {
    await new Promise((resolve,reject)=>{
      const sql = `delete from role where id = ${id}`
      db.query(sql,(err,results)=>{
        if(err) reject(err)
        if(results.affectedRows<1) reject('删除role表失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //4.根据role_id和roles_id删除roles表中对应的数据
  if(role_id&&roles_id){
    try {
      await new Promise((resolve,reject)=>{
        const sql = `delete from roles where role_id = ${role_id} and roles_id = ${roles_id}`
        db.query(sql,(err,results)=>{
          if(err) reject(err)
          if(results.affectedRows<1) reject('删除roles表失败')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
  }
    res.json({
      code:200,
      message:'删除角色成功'
    })

}
//根据id批量删除角色
exports.deleteRoles = async (req,res)=>{
  const ids = req.body
  //1.根据ids获取role表中对应的role_id
  let role_ids = []
  try {
    role_ids = await new Promise((resolve,reject)=>{
      const sql = `select role_id from role where id in (${ids})`
      db.query(sql,(err,results)=>{
        if(err) reject(err)
        if(results.length<1) reject('查询role表失败')
        resolve(results)
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //2.将role_ids中的role_id取出来
  let role_id = []
  role_ids.forEach((item)=>{
    role_id.push(item.role_id)
  })
  //3.根据role_id删除roleAcl表中对应的数据
  try {
    await new Promise((resolve,reject)=>{
      const sql = `delete from roleAcl where role_id in (${role_id})`
      db.query(sql,(err,results)=>{
        if(err) reject(err)
        if(results.affectedRows<1) reject('删除roleAcl表失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //4.根据ids删除role表中对应的数据
  try {
    await new Promise((resolve,reject)=>{
      const sql = `delete from role where id in (${ids})`
      db.query(sql,(err,results)=>{
        if(err) reject(err)
        if(results.affectedRows<1) reject('删除role表失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  res.json({
    code:200,
    message:'批量删除角色成功'
  })
}