const db = require('../../db')
// exports.getAdminInfo = async (req, res) => {
//   let adminInfo = '' //adminInfo表的数据
//   let aclRoute = ''
//   let aclChildrenRoute = []
//   //1.根据id获取adminInfo表的数据
//   //req对象身上的user属性 是Token解析成功，express-jwt中间件帮我们挂载上去的
//   try {
//     adminInfo = await new Promise((resolve, reject) => {
//       const sql = `select * from adminInfo where id=?`
//       db.query(sql, req.user.id, (err, results) => {
//         if (err) reject(err)
//         if (results.length < 1) reject('获取用户信息失败')
//         resolve(results[0])
//       })
//     })
//   } catch (error) {
//     res.cc(error)
//   }
//   //2.根据adminInfo表的routes_id与route_parent_id获取aclRoute表的数据
//   try {
//     aclRoute = await new Promise((resolve, reject) => {
//       const sql = `select * from aclRoute where route_parent_id=?`
//       db.query(sql, adminInfo.routes_id, (err, results) => {
//         if (err) reject(err)
//         if (results.length < 1) reject('获取用户权限失败')
//         resolve(results)
//       })
//     })
//   } catch (error) {
//     res.cc(error)
//   }
//   //3.根据aclRoute表的route_id与route_parent_id获取aclChildrenRoute表的数据
//   try {
//     await new Promise((resolve, reject) => {
//       const sql = `select * from aclChildrenRoute `
//       db.query(sql, (err, results) => {
//         if (err) reject(err)
//         if (results.length < 1) reject('获取aclChildrenRoute失败')
//         aclChildrenRoute.push(...results)
//         resolve('ok')
//       })
//     })
//   } catch (error) {
//     res.cc(error)
//   }
//   //4.将aclRoute和aclChildrenRoute合并
//   aclRoute.forEach((item) => {
//     item.children = []
//   })
//   for (var i = 0; i < aclRoute.length; i++) {
//     for (var j = 0; j < aclChildrenRoute.length; j++) {
//       if (aclRoute[i].route_id == aclChildrenRoute[j].route_parent_id) {
//         aclRoute[i].children.push(aclChildrenRoute[j])
//       }
//     }
//   }
//    //5.将adminInfo和aclRoute合并
//   adminInfo.routes=[]
//   // myCombine(adminInfo,aclRoute,routes_id,route_parent_id,routes)
//   for(let i = 0 ; i<aclRoute.length;i++){
//     if(adminInfo.routes_id==aclRoute[i].route_parent_id){
//       adminInfo.routes.push(aclRoute[i])
//     }
//   }
//   res.json({
//     "code":200,
//     "message":"获取用户信息成功",
//     "data":adminInfo
//   })
// }
exports.getAdminInfo = async (req, res) => {
  let adminInfo1 = '' //adminInfo1表的数据
  let routes = []
  let buttons = []
  //1.根据admin_id获取adminInfo表的数据
  //req对象身上的user属性 是Token解析成功，express-jwt中间件帮我们挂载上去的
  try {
    adminInfo1 = await new Promise((resolve, reject) => {
      const sql = `select * from adminInfo1 where admin_id=?`
      db.query(sql, req.user.admin_id, (err, results) => {
        if (err) reject(err)
        if (results.length < 1) reject('获取用户信息失败')
        resolve(results[0])
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  //2.根据adminInfo.roles_id获取role_id列表
  let role_id = []
  try {
    await new Promise((resolve, reject) => {
      const sql = `select role_id from roles where roles_id=?`
      db.query(sql, adminInfo1.roles_id, (err, results) => {
        if (err) reject(err)
        results.forEach((item) => {
          role_id.push(item.role_id)
        })
        resolve('ok')
      })
    })
  } catch (error) {
    return res.cc(error)
  }
  if (role_id.length != 0) {
    //3.根据role_id列表获取roleAcl表并添加进roleAclList数组
    let roleAclList = []
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from roleAcl where role_id in (?)`
        db.query(sql, [role_id], (err, results) => {
          if (err) reject(err)
          roleAclList.push(...results)
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //4.遍历roleAclList数组，如果acl_level=1则说明是一级菜单对应的表是aclMenus1 再将acl_id和aclMenus1表的acl_id进行匹配，如果匹配成功则将aclMenus1表的数据添加进routes数组
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from aclMenus1`
        db.query(sql, (err, results) => {
          if (err) reject(err)
          roleAclList.forEach((item) => {
            if (item.acl_level == 1) {
              results.forEach((item1) => {
                if (item.acl_id == item1.acl_id) {
                  routes.push(item1.aclValue)
                }
              })
            }
          })
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //5.遍历roleAclList数组，如果acl_level=2则说明是二级菜单对应的表是aclMenus2 再将acl_id和aclMenus2表的acl_id进行匹配，如果匹配成功则将aclMenus2表的数据添加进routes数组
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from aclMenus2`
        db.query(sql, (err, results) => {
          if (err) reject(err)
          roleAclList.forEach((item) => {
            if (item.acl_level == 2) {
              results.forEach((item1) => {
                if (item.acl_id == item1.acl_id) {
                  routes.push(item1.aclValue)
                }
              })
            }
          })
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
    //6.遍历roleAclList数组，如果acl_level=3则说明是二级菜单对应的表是aclMenus3 再将acl_id和aclMenus3表的acl_id进行匹配，如果匹配成功则将aclMenus3表的数据添加进buttons数组
    try {
      await new Promise((resolve, reject) => {
        const sql = `select * from aclMenus3`
        db.query(sql, (err, results) => {
          if (err) reject(err)
          roleAclList.forEach((item) => {
            if (item.acl_level == 3) {
              results.forEach((item1) => {
                if (item.acl_id == item1.acl_id) {
                  buttons.push(item1.aclValue)
                }
              })
            }
          })
          resolve('ok')
        })
      })
    } catch (error) {
      return res.cc(error)
    }
  }
  //7.将adminInfo1和routes和buttons返回给前端
  res.send({
    code:200,
    message: '获取用户信息成功',
    data: {
      adminInfo:adminInfo1,
      routes,
      buttons,
    },
  })
}

//2.根据adminInfo表的routes_id与route_parent_id获取aclRoute表的数据
// try {
//   aclRoute = await new Promise((resolve, reject) => {
//     const sql = `select * from aclRoute where route_parent_id=?`
//     db.query(sql, adminInfo.routes_id, (err, results) => {
//       if (err) reject(err)
//       if (results.length < 1) reject('获取用户权限失败')
//       resolve(results)
//     })
//   })
// } catch (error) {
//   res.cc(error)
// }
//3.根据aclRoute表的route_id与route_parent_id获取aclChildrenRoute表的数据
// try {
//   await new Promise((resolve, reject) => {
//     const sql = `select * from aclChildrenRoute `
//     db.query(sql, (err, results) => {
//       if (err) reject(err)
//       if (results.length < 1) reject('获取aclChildrenRoute失败')
//       aclChildrenRoute.push(...results)
//       resolve('ok')
//     })
//   })
// } catch (error) {
//   res.cc(error)
// }
//4.将aclRoute和aclChildrenRoute合并
// aclRoute.forEach((item) => {
//   item.children = []
// })
// for (var i = 0; i < aclRoute.length; i++) {
//   for (var j = 0; j < aclChildrenRoute.length; j++) {
//     if (aclRoute[i].route_id == aclChildrenRoute[j].route_parent_id) {
//       aclRoute[i].children.push(aclChildrenRoute[j])
//     }
//   }
// }
//  //5.将adminInfo和aclRoute合并
// adminInfo.routes=[]
// // myCombine(adminInfo,aclRoute,routes_id,route_parent_id,routes)
// for(let i = 0 ; i<aclRoute.length;i++){
//   if(adminInfo.routes_id==aclRoute[i].route_parent_id){
//     adminInfo.routes.push(aclRoute[i])
//   }
// }
// res.json({
//   "code":200,
//   "message":"获取用户信息成功",
//   "data":adminInfo
// })
