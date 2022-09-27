const db=require('../../../db')
const baseUrl ='http://192.168.123.147:3007'
//账号密码存储上传图片
exports.pswMngImg=(req,res)=>{
  // req.file 是 `avatar` 文件的信息
 // req.body 将具有文本域数据，如果存在的话
 let file = req.file
 return res.json({
  code:200,
  message:'上传头像成功',
  imgUrl: `${baseUrl + '/admin/fileUpload/pswMngImg/' + file.originalname}`,
})
//  const sqlStr = `insert into  pswMngImg  set LOGO=("${'/pswMngImg/' + file.originalname}") `
//  db.query(sqlStr, (err, results) => {
//    if (err) return res.cc(err)
//  })
}
//tradeMark 品牌管理上传照片
exports.tradeMarkImg=(req,res)=>{
  let file = req.file
  return res.json({
   code:200,
   message:'上传头像成功',
   imgUrl: `${baseUrl + '/admin/fileUpload/tradeMarkImg/' + file.originalname}`,
 })
}
//spu 品牌管理上传照片
exports.spuImg=(req,res)=>{
  let file = req.file
  return res.json({
   code:200,
   message:'上传头像成功',
   imgUrl: `${baseUrl + '/admin/fileUpload/spuImg/' + file.originalname}`,
 })
}