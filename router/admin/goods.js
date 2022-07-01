const express =require('express')
const router = express.Router()

const router_handle_admin_goods=require('../../router_handle/admin/goods')
//创建管理员获取三级分类路由

//一级
router.get('/goods/getCategory1',router_handle_admin_goods.getCategory1)

module.exports=router