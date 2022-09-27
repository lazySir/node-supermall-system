const express =require('express')
const router = express.Router()
const router_handle_admin_sku = require('../../../router_handle/admin/product/sku')
router.get('/product/sku/getSkuList/:page/:limit',router_handle_admin_sku.getSkuList)
router.get('/product/sku/getSkuById/:id',router_handle_admin_sku.getSkuById)
router.put('/product/sku/shelves/:id',router_handle_admin_sku.shelves)
router.put('/product/sku/TheShelves/:id',router_handle_admin_sku.TheShelves)
router.delete('/product/sku/deleteById/:id',router_handle_admin_sku.deleteById)
module.exports=router