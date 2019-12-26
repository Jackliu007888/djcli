module.exports = {
  prompts: [{
    name: 'controllerName',
    message: '请输入 controller 名称'
  }],
  stringFn({controllerName}) {
    return `
/**
 * @param {Egg.Application} app - egg application
 */
const { API_VERSION_PREFIX } = require('../utils/enums/router')

module.exports = app => {
  const { router, controller } = app
  const subRouter = router.namespace(API_VERSION_PREFIX + '/${controllerName}')

  subRouter.post('/getList', controller.${controllerName}.getList)
  subRouter.post('/create', controller.${controllerName}.create)
  subRouter.post('/remove', controller.${controllerName}.remove)
  subRouter.post('/update', controller.${controllerName}.update)
}

`
  },
}