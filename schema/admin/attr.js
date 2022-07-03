//校验管理员获取平台属性接口的规则
const joi = require('@hapi/joi')
//校验管理员获取平台属性接口的规则
const category1Id =joi.number().required().error(new Error('一级分类id必须为数值！'))
const category2Id =joi.number().required().error(new Error('二级分类id必须为数值！'))
const category3Id =joi.number().required().error(new Error('三级分类id必须为数值！'))
exports.admin_schema_attr = {
  params:{
    category1Id,
    category2Id,
    category3Id
  }
}
