const Utils = require('../../utils')

module.exports = {
  version: '1.0.0',
  description: 'controller 模板文件',
  prompts: [{
    name: 'controllerName',
    message: '请输入 controller 名称'
  }],
  stringFn({controllerName}) {
    return `
const Controller = require('egg').Controller

class ${Utils.firstUpperCase(controllerName)}Controller extends Controller {
  constructor(ctx) {
    super(ctx)

    this.getListRule = {
      id: { type: 'string', required: true, allowEmpty: false },
    }

    this.createRule = {
    }

    this.removeRule = {
      ids: { type: 'array', itemType: 'string' }
    }
    this.updateRule = {
      id: { type: 'string', required: true, allowEmpty: false },
    }
  }

  async getList() {
    const {
      ctx,
      ctx: {
        request: {
          body = {}
        }
      }
    } = this

    ctx.validate(this.getListRule)

    const { res, pager } = await ctx.service.${controllerName}.getList(body)

    ctx.helper.success({
      ctx,
      res,
      pager
    })
  }

  async create() {
    const {
      ctx,
      ctx: {
        request: {
          body = {}
        }
      }
    } = this

    ctx.validate(this.createRule)

    const res = await ctx.service.${controllerName}.create(body)

    ctx.helper.success({
      ctx,
      res,
    })
  }

  async remove() {
    const {
      ctx,
      ctx: {
        request: {
          body = {}
        }
      }
    } = this
    ctx.validate(this.removeRule)
    const res = await ctx.service.${controllerName}.remove(body)

    ctx.helper.success({
      ctx,
      res,
    })
  }

  async update() {
    const {
      ctx,
      ctx: {
        request: {
          body = {}
        }
      }
    } = this

    ctx.validate(this.updateRule)

    const res = await ctx.service.${controllerName}.update(body)

    ctx.helper.success({
      ctx,
      res,
    })
  }
}


module.exports = ${Utils.firstUpperCase(controllerName)}Controller

`
  },
}