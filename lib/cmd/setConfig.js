const fse = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')

const tip = require('../tip')

module.exports = async () => {
  const configPath = path.join(__dirname, '../../config.json')
  const config = await fse.readJson(configPath)

  if (config && config.gitAccount && config.gitPassword) { 
    tip.info('当前配置信息是: \n')
    
    require('./config')()

    const { isContinue } = await inquirer.prompt([{
      name: 'isContinue',
      message: '是否继续? 继续请输入 y or yes'
    }])
    if (isContinue.toLowerCase() !== 'yes' && isContinue.toLowerCase() !== 'y') {
      process.exit()
    }
  }

  const {
    gitAccount,
    gitPassword
  } = await inquirer.prompt([{
    name: 'gitAccount',
    message: '请输入 git 账号',
  }, {
    name: 'gitPassword',
    message: '请输入 git 密码',
  }])
  await fse.writeJSONSync(configPath, {
    gitAccount,
    gitPassword
  })
  
  tip.info('已修改配置信息')
}