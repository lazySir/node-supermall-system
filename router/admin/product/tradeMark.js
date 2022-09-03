const express = require('express')
const router = express.Router()
const router_handle_product_tradeMark = require('../../../router_handle/admin/product/tradeMark')

router.get('/product/tradeMark/get/:page/:limit',router_handle_product_tradeMark.getBrandList)
router.post('/product/tradeMark/add',router_handle_product_tradeMark.addBrand)
router.put('/product/tradeMark/update',router_handle_product_tradeMark.updateBrand)
router.delete('/product/tradeMark/delete/:id',router_handle_product_tradeMark.deleteBrand)
router.post('/product/tradeMark/getById/:page/:limit',router_handle_product_tradeMark.getBrandListById)
router.get('/product/tradeMark/getByName/:page/:limit/:searchBrand',router_handle_product_tradeMark.getBrandByName)
module.exports=router