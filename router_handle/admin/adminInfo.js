const db=require('../../db')
exports.getAdminInfo=(req,res)=>{
  //req对象身上的user属性 是Token解析成功，express-jwt中间件帮我们挂载上去的
  const sql = `select * from adminInfo where id=?`
  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取用户信息失败')
    res.send({
      code: 200,
      message: '获取用户信息成功',
      data: results[0],
    })
  })
}
