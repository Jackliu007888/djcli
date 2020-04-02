const Table = require('cli-table')
const Path = require('path')
const fse = require('fs-extra')

const tip = require('../tip')

const table = new Table({
  head: ['NAME', 'TYPE','VERSION', 'URL', 'DESCRIPTION' ],
  style: {
    head: ['cyan']
  }
})

module.exports = () => {

  {
    const {
      templates,
      version
    } = require('../../templates/project')

    Object.keys(templates).forEach((key) => {
      const {
        description,
        url
      } = templates[key]
      table.push(
        [key, 'project', version, url, description]
      )
    })
  }
  {
    const {
      templates,
      version
    } = require('../../templates/block')

    Object.keys(templates).forEach((key) => {
      const {
        description,
        url
      } = templates[key]
      table.push(
        [key, 'block', version, url, description]
      )
    })
  }
  {
    const filePath = Path.join(__dirname, '../../templates/files')
    const fileList = fse.readdirSync(filePath)
    fileList.forEach(fileaName => {
      const file = require(Path.join(filePath, '/', fileaName))
      table.push(
        [fileaName.replace('.js', ''), 'file', file.version,  '-', file.description,]
      )
    })
  }
  const list = table.toString()
  if (list) {
    tip.info('模板列表是: ')
    console.log(`${list}\n`)
  } else {
    tip.fail('模板不存在!')
  }
  process.exit()
}