const Table = require('cli-table')

const tip = require('../tip')

const table = new Table({
  head: ['KEY', 'VALUE' ],
  style: {
    head: ['cyan']
  }
})

module.exports = () => {
  const config = require('../../config')
  const keys = Object.keys(config)

  if (keys.length) {
    keys.forEach((key) => {
      const value = config[key]
      table.push(
        [key, value]
      )
    })
    const list = table.toString()
    if (list) {
      console.log(`${list}\n`)
    } else {
      tip.fail('配置不存在!')
    }
  } else {
    tip.fail('配置不存在!')
  }
  // process.exit()
}