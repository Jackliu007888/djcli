const program = require('commander')
const PKG = require('../../package.json')

program.version(PKG.version)

program
  .command('init')
  .description('生成一个项目')
  .alias('i') // 简写
  .action(() => {
    require('../cmd/init')()
  })


program
  .command('list')
  .description('查看模板列表')
  .alias('l') 
  .action(() => {
    require('../cmd/list')()
  })

program
  .command('config')
  .description('查看配置信息')
  .alias('c') 
  .action(() => {
    require('../cmd/config')()
  })

program
  .command('setConfig')
  .description('设置配置')
  .alias('sc') 
  .action(() => {
    require('../cmd/setConfig')()
  })

program
  .command('new')
  .description('新建模板文件')
  .alias('n') 
  .action(() => {
    require('../cmd/new')()
  })

program.parse(process.argv)

if(!program.args.length){
  program.help()
}