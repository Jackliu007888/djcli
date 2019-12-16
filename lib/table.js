const Table = require('cli-table')

const tip = require('./tip')

const table = new Table({
  head: ['NAME', 'URL', 'BRANCH', 'DESCRIPTION',],
  style: {
    head: ['cyan']
  }
})

module.exports = (config) => {
  const { templates, version } = config
  const keys = Object.keys(templates)
  tip.info(`模板版本是: ${version}`)

  if(keys.length) {
    keys.forEach((key) => {
      const { url, branch, description } = templates[key]
      table.push(
        [`${key}`, url, branch, description]
      )
    })
    const list = table.toString()
    if (list) {
      tip.info('模板列表是: ')
      console.log(`${list}\n`)
    } else {
      tip.fail('模板不经存在!')
    }
  } else {
    tip.fail('模板不经存在!')
  }
}