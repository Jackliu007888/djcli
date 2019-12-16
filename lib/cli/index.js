const program = require('commander')
const PKG = require('../../package.json')

program.version(PKG.version)

program
  .command('init') // fe init
  .description('生成一个项目')
  .alias('i') // 简写
  .action(() => {
    require('../cmd/init')()
  })


program
  .command('list') // fe list
  .description('查看模板列表')
  .alias('l') 
  .action(() => {
    require('../cmd/list')()
  })

program.parse(process.argv)

if(!program.args.length){
  program.help()
}