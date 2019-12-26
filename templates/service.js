const Utils = require('../utils')

module.exports = {
  prompts: [{
    name: 'repoName',
    message: '请输入 repoName 名称'
  }],
  stringFn({repoName}) {
    return `
const Service = require('egg').Service
const API = require('../api')

class ${Utils.firstUpperCase(repoName)}Service extends Service {
  async getList(payload) {
    const { ctx, app } = this

    /* eslint-disable-next-line */
    const { op, getRepo } = ctx.helper
    const {
      pageSize = 10,
      curPageNum = 1,
      // TODO: 补充
    } = payload

    const condition = {}

    const { records, total, } = await app.$http.post(API.mpInformation + '/${repoName}/page', {
      condition,
      fieldNames: [
        'id',
        'createInfo.timestamp',
        // TODO: 补充
      ],
      pager: {
        curPageNum,
        pageSize,
      }
    })

    return {
      res: records,
      pager: {
        curPageNum,
        pageSize,
        totalCount: total,
      }
    }
  }

  async create(payload) {
    const { ctx, app } = this
    const { op, getRepo } = ctx.helper


    const id = await app.getAsyncBatchId(4)

    const ops = []
    ops.push(op.add(getRepo('${repoName}'), {
      id,
      ...payload
      // TODO: 补充
    }))

    return await app.$httpBatch(ops)
  }

  async remove(payload) {
    const { ctx, app } = this
    const { ids = [] } = payload
    const { op, getRepo } = ctx.helper

    return await app.$httpBatch([
      op.batchDelete(getRepo('${repoName}'), ids)
    ])
  }

  async update(payload) {
    const { ctx, app } = this
    const {
      id = '',
    } = payload

    const { op, getRepo } = ctx.helper

    return await app.$httpBatch([
      op.update(getRepo('${repoName}'), {
        id,
        // TODO: 补充
      })
    ])
  }
}

module.exports = ${Utils.firstUpperCase(repoName)}Service

`
  },
}