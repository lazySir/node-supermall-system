const db = require('../../../db')
//导入bcryptjs  用来加密密码
const bcrypt = require('bcryptjs')

//获取用户列表
exports.get = async (req, res) => {
  //1.根据page,limit获取当前页的数据
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  let offset = (page - 1) * limit
  let totalAdmin = ''
  //2.获取admin总条数
  try {
    await new Promise((resolve, reject) => {
      const sqlA = 'select count(*) as totalAdmin from admin'
      db.query(sqlA, (err, results) => {
        if (err) reject(err)
        totalAdmin = results[0].totalAdmin
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //3.将admin表和adminInfo1表通过admin_id进行关联并且获取数据
  let adminList = []
  try {
    await new Promise((resolve, reject) => {
      const sqlB = `select * from admin left join adminInfo1 on admin.admin_id=adminInfo1.admin_id  limit ${offset},${limit}`
      db.query(sqlB, (err, results) => {
        if (err) reject(err)
        adminList = results
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //4.给adminList添加一个role_id数组
  adminList.forEach((item) => {
    item.role_id = []
    item.role_name = []
  })
  //5.通过roles_id查询roles表中的role_id将其添加到item.role_id中
  try {
    await new Promise((resolve, reject) => {
      const sqlC = 'select * from roles'
      db.query(sqlC, (err, results) => {
        if (err) reject(err)
        results.forEach((item) => {
          adminList.forEach((item2) => {
            if (item2.roles_id === item.roles_id) {
              item2.role_id.push(item.role_id)
            }
          })
        })
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //6.如果存在role_id则根据role_id查询role表中的role_name添加进role_name
  try {
    await new Promise((resolve, reject) => {
      const sqlD = 'select * from role'
      db.query(sqlD, (err, results) => {
        if (err) reject(err)
        results.forEach((item) => {
          adminList.forEach((item2) => {
            item2.role_id.forEach((item3) => {
              if (item3 === item.role_id) {
                item2.role_name.push(item.name)
              }
            })
          })
        })
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //7.删除adminList中的password
  adminList.forEach((item) => {
    delete item.password
  })
  //8.返回数据
  res.json({
    code: 200,
    message: '获取用户列表成功',
    data: {
      total: totalAdmin,
      adminList,
    },
  })
}

//用户注册
exports.register = async (req, res) => {
  //1.获取客户端提交到服务器的用户信息
  const adminInfo = req.body //username , password ,name
  //2.定义sql语句查询用户名是否被占用
  try {
    await new Promise((resolve, reject) => {
      const sqlA = 'select * from admin where username=?'
      db.query(sqlA, adminInfo.username, (err, results) => {
        if (err) reject(err)
        if (results.length === 1) reject('用户名被占用')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //3.如果没有被占用，获取admin表的admin_id的最大值
  let admin_id = ''
  try {
    await new Promise((resolve, reject) => {
      const sqlB = 'select max(admin_id) as maxId from admin'
      db.query(sqlB, (err, results) => {
        if (err) reject(err)
        admin_id = results[0].maxId + 1
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //4.对密码进行加密
  adminInfo.password = bcrypt.hashSync(adminInfo.password, 10)
  //5.将数据写入admin表admin_id值为admin_id+1
  try {
    await new Promise((resolve, reject) => {
      const sqlC = 'insert into admin set ?'
      db.query(sqlC, { username: adminInfo.username, password: adminInfo.password, admin_id }, (err, results) => {
        if (err) reject(err)
        if (results.affectedRows !== 1) reject('注册失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //6.获取adminInfo1表的roles_id的最大值
  let roles_id = ''
  try {
    await new Promise((resolve, reject) => {
      const sqlD = 'select max(roles_id) as maxId from adminInfo1'
      db.query(sqlD, (err, results) => {
        if (err) reject(err)
        roles_id = results[0].maxId + 1
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //7.获取现在时间格式为yy-mm-dd-hh--mm-ss
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  let time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  //7.将数据写入adminInfo1表
  try {
    await new Promise((resolve, reject) => {
      const sqlD = 'insert into adminInfo1 set ?'
      db.query(sqlD, { admin_id, createTime: time, updateTime: time, roles_id, name: adminInfo.name }, (err, results) => {
        if (err) reject(err)
        if (results.affectedRows !== 1) reject('注册失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //7.返回成功信息
  res.json({
    code: 200,
    message: '添加用户成功',
  })
}

//修改状态码
exports.updateState = async (req, res) => {
  const { id, state } = req.params
  //根据id修改adminInfo1表的state 如果为true则为1 false为0
  try {
    await new Promise((resolve, reject) => {
      const sqlA = 'update adminInfo1 set state=? where id=?'
      db.query(sqlA, [state === 'true' ? 1 : 0, id], (err, results) => {
        if (err) reject(err)
        if (results.affectedRows !== 1) reject('修改状态失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //返回成功信息
  res.json({
    code: 200,
    message: '修改状态成功',
  })
}
//搜索
exports.searchUser = async (req, res) => {
  const { page, limit, name } = req.params
  //1.根据page，limit计算offset
  const offset = (page - 1) * limit
  //2.根据name模糊查询adminInfo1表的数据条数
  let totalAdmin = 0
  let adminList = []
  try {
    await new Promise((resolve, reject) => {
      const sqlA = 'select count(*) as totalAdmin from adminInfo1 where name like ?'
      db.query(sqlA, ['%' + name + '%'], (err, results) => {
        if (err) reject(err)
        totalAdmin = results[0].totalAdmin
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //3.根据name模糊查询adminInfo1表的数据
  try {
    await new Promise((resolve, reject) => {
      const sqlB = `select * from adminInfo1 where name like ? limit ${offset},${limit}`
      db.query(sqlB, '%' + name + '%', (err, results) => {
        if (err) reject(err)
        adminList = results
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //4.查询admin表的数据
  try {
    await new Promise((resolve, reject) => {
      const sqlC = 'select * from admin'
      db.query(sqlC, (err, results) => {
        if (err) reject(err)
        adminList.forEach((item) => {
          results.forEach((item1) => {
            if (item.admin_id === item1.admin_id) {
              item.username = item1.username
            }
          })
        })
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //5.给adminList添加一个role_id数组
  adminList.forEach((item) => {
    item.role_id = []
    item.role_name = []
  })
  //6.通过roles_id查询roles表中的role_id将其添加到item.role_id中
  try {
    await new Promise((resolve, reject) => {
      const sqlC = 'select * from roles'
      db.query(sqlC, (err, results) => {
        if (err) reject(err)
        results.forEach((item) => {
          adminList.forEach((item2) => {
            if (item2.roles_id === item.roles_id) {
              item2.role_id.push(item.role_id)
            }
          })
        })
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //7.如果存在role_id则根据role_id查询role表中的role_name添加进role_name
  try {
    await new Promise((resolve, reject) => {
      const sqlD = 'select * from role'
      db.query(sqlD, (err, results) => {
        if (err) reject(err)
        results.forEach((item) => {
          adminList.forEach((item2) => {
            item2.role_id.forEach((item3) => {
              if (item3 === item.role_id) {
                item2.role_name.push(item.name)
              }
            })
          })
        })
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //8.返回成功信息
  res.json({
    code: 200,
    message: '查询成功',
    data: {
      total: totalAdmin,
      adminList,
    },
  })
}
//删除某个用户
exports.deleteUser = async (req, res) => {
  const { admin_id } = req.params
  //1.根据admin_id删除admin表中的数据
  try {
    await new Promise((resolve, reject) => {
      const sqlA = 'delete from admin where admin_id=?'
      db.query(sqlA, admin_id, (err, results) => {
        if (err) reject(err)
        if (results.affectedRows !== 1) reject('删除失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //2.根据admin_id获取adminInfo1表中的roles_id
  let roles_id = ''
  try {
    await new Promise((resolve, reject) => {
      const sqlB = 'select roles_id from adminInfo1 where admin_id=?'
      db.query(sqlB, admin_id, (err, results) => {
        if (err) reject(err)
        if (results.length !== 1) reject('获取roles_id失败')
        roles_id = results[0].roles_id
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //3.根据roles_id删除roles表的数据
  try {
    await new Promise((resolve, reject) => {
      const sqlC = 'delete from roles where roles_id=?'
      db.query(sqlC, roles_id, (err, results) => {
        if (err) reject(err)
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //4.根据admin_id删除adminInfo1表中的数据
  try {
    await new Promise((resolve, reject) => {
      const sqlD = 'delete from adminInfo1 where admin_id=?'
      db.query(sqlD, admin_id, (err, results) => {
        if (err) reject(err)
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //5.返回成功信息
  res.json({
    code: 200,
    message: '删除成功',
  })
}
//修改账号和用户昵称
exports.updateUser = async (req, res) => {
  let user = req.body
  const { admin_id, name, username } = user
  //0.根据admin_id查询admin表中是否有重复的username
  try {
    await new Promise((resolve, reject) => {
      const sqlA = 'select * from admin where username=? and admin_id!=?'
      db.query(sqlA, [username, admin_id], (err, results) => {
        if (err) reject(err)
        if (results.length !== 0) reject('用户名已存在')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //1.根据admin_id修改admin表中的username
  try {
    await new Promise((resolve, reject) => {
      const sqlA = 'update admin set username=? where admin_id=?'
      db.query(sqlA, [username, admin_id], (err, results) => {
        if (err) reject(err)
        if (results.affectedRows !== 1) reject('修改账号失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //2.根据admin_id修改adminInfo1表中的name
  try {
    await new Promise((resolve, reject) => {
      const sqlB = 'update adminInfo1 set name=? where admin_id=?'
      db.query(sqlB, [name, admin_id], (err, results) => {
        if (err) reject(err)
        if (results.affectedRows !== 1) reject('修改姓名失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //3.获取现在时间格式在YYYY-MM-DD HH:mm:ss
  //7.获取现在时间格式为yy-mm-dd-hh--mm-ss
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  let time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  //4.根据admin_id修改adminInfo1表中的updateTime
  try {
    await new Promise((resolve, reject) => {
      const sqlC = 'update adminInfo1 set updateTime=? where admin_id=?'
      db.query(sqlC, [time, admin_id], (err, results) => {
        if (err) reject(err)
        if (results.affectedRows !== 1) reject('修改更新时间失败')
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //5.返回成功信息
  res.json({
    code: 200,
    message: '授权成功',
  })
}
//获取用户角色
exports.getUserRole = async (req, res) => {
  //1.获取参数
  let roles_id = req.params.roles_id
  //2.获取role表数据
  let roleList = []
  try {
    await new Promise((resolve, reject) => {
      const sqlA = 'select * from role'
      db.query(sqlA, (err, results) => {
        if (err) reject(err)
        roleList = results
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //3.给roleList加个isChecked属性
  roleList.forEach((item) => {
    item.isChecked = false
  })
  //4.根据roles_id获取roles表中所有的role_id并添加进role_idList中
  let role_idList = []
  try {
    await new Promise((resolve, reject) => {
      const sqlB = 'select role_id from roles where roles_id=?'
      db.query(sqlB, roles_id, (err, results) => {
        if (err) reject(err)
        results.forEach((item) => {
          role_idList.push(item.role_id)
        })
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //5.如果role_idList不为空则将roleList中对应的role_id的isChecked属性改为true
  if (role_idList.length !== 0) {
    roleList.forEach((item) => {
      role_idList.forEach((item2) => {
        if (item.role_id === item2) {
          item.isChecked = true
        }
      })
    })
  }
  //6.返回数据
  res.json({
    code: 200,
    message: '获取成功',
    data: roleList,
  })
}
//更新用户角色
exports.updateUserRole = async (req, res) => {
  const { user, CheckedRoles } = req.body
  //1.根据roles_id删除roles表中的数据
  try {
    await new Promise((resolve, reject) => {
      const sqlA = 'delete from roles where roles_id=?'
      db.query(sqlA, user.roles_id, (err, results) => {
        if (err) reject(err)
        resolve()
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  if (CheckedRoles.length !== 0) {
    //2.将CheckedRoles和role表中name对比如果相同则将role_id并添加进role_idList中
    let role_idList = []
    try {
      await new Promise((resolve, reject) => {
        const sqlB = 'select * from role'
        db.query(sqlB, (err, results) => {
          if (err) reject(err)
          results.forEach((item) => {
            CheckedRoles.forEach((item2) => {
              if (item.name === item2) {
                role_idList.push(item.role_id)
              }
            })
          })
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //3.将role_idList和roles_id添加进roles表中
    try {
      await new Promise((resolve, reject) => {
        const sqlC = 'insert into roles set ?'
        role_idList.forEach((item) => {
          db.query(sqlC, { roles_id: user.roles_id, role_id: item }, (err, results) => {
            if (err) reject(err)
            resolve()
          })
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //4.获取现在时间
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    //5.根据admin_id修改adminInfo1表中的updateTime
    try {
      await new Promise((resolve, reject) => {
        const sqlD = 'update adminInfo1 set updateTime=? where admin_id=?'
        db.query(sqlD, [time, user.admin_id], (err, results) => {
          if (err) reject(err)
          if (results.affectedRows !== 1) reject('修改更新时间失败')
          resolve()
        })
      })
    } catch (error) {
      return res.cc(error)
    }
  }
  //6.返回成功信息
  res.json({
    code: 200,
    message: '修改成功',
  })
}