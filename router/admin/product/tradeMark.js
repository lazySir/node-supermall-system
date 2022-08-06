const express = require('express')
const router = express.Router()
const router_handle_product_tradeMark = require('../../../router_handle/admin/product/tradeMark')

router.get('/product/tradeMark/get/:page/:limit',router_handle_product_tradeMark.getBrandList)
router.post('/product/tradeMark/add',router_handle_product_tradeMark.addBrand)
router.put('/product/tradeMark/update',router_handle_product_tradeMark.updateBrand)
router.delete('/product/tradeMark/delete/:id',router_handle_product_tradeMark.deleteBrand)
module.exports=router