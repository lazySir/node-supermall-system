//校验管理员获取商品接口的规则
const joi = require('@hapi/joi')
const category1Id =joi.number().required().error(new Error('一级分类id必须为数值！'))
const category2Id =joi.number().required().error(new Error('二级分类id必须为数值！'))
exports.admin_schema_category2Id = {
  params:{
    category1Id
  }
}
exports.admin_schema_category3Id = {
  params:{
    category2Id
  }
}