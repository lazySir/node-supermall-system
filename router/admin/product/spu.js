const express = require('express')
const router = express.Router()
const router_handle_admin_spu =require('../../../router_handle/admin/product/spu')
//根据三级分类获取spu列表
router.post('/product/spu/getListById/:page/:limit',router_handle_admin_spu.getSkuListById)
//添加spu
router.post('/product/spu/add',router_handle_admin_spu.add)
//根据spu_img_id获取图片列表
router.get('/product/spu/getSpuImgListBySpuId/:spu_img_id',router_handle_admin_spu.getSpuImgListBySpuId)
//根据spu_sale id获取销售属性列表 sku添加
router.get('/product/spu/getSpuSaleListBySpuId/:spu_sale_id',router_handle_admin_spu.getSpuSaleListBySpuId)
//spu修改
router.get('/product/spu/getSpuSaleListBySpuId2/:spu_sale_id',router_handle_admin_spu.getSpuSaleListBySpuId2)
//添加sku
router.post('/product/spu/addSku',router_handle_admin_spu.addSku)
//根据spu_id获取spu信息
router.get('/product/spu/getSpuInfoById/:spu_Id',router_handle_admin_spu.getSpuInfoById)
//修改spu
router.put('/product/spu/updateSpu',router_handle_admin_spu.updateSpu)
//根据spu_id获取sku列表
router.get('/product/spu/getSkuById/:spu_id',router_handle_admin_spu.getSkuById)
module.exports=router