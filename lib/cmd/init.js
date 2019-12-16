const exec = require('child_process').exec
const ora = require('ora')
const inquirer = require('inquirer')
const fse = require('fse')
const path = require('path')
const querystring = require('querystring')

const tip = require('../tip')
const TMPS = require('../../templates')

const spinner = ora('正在生成...')

const execRm = (err, projectName) => {
  spinner.stop()

  if (err) {
    console.log(err)
    tip.fail('请重新运行!')
    process.exit()
  }

  tip.suc('初始化完成！')
  tip.info(`cd ${projectName} && npm install`)
  process.exit()
}


const resolve = (result) => {
  const {
    url,
    branch,
    projectName,
    config,
  } = result
  // git命令，远程拉取项目并自定义项目名
  const cmdStr = `git clone -b ${branch} ${url} ${projectName}`

  spinner.start()

  exec(cmdStr, (err) => {
    if (err) {
      console.log(err)
      tip.fail('请重新运行!')
      process.exit()
    }
    // 删除 git 文件
    exec('cd ' + projectName + ' && rm -rf .git', (err, out) => {
      execRm(err, projectName)
    })
  })
}

module.exports = async () => {

  const { templateName } = await inquirer.prompt([{
    name: 'templateName',
    message: '请输入模板名称'
  }])

  if (!templateName || !TMPS.templates[templateName]) {
    tip.fail('模板不存在!')
    process.exit()
  }

  const configPath = path.join(__dirname, '../../config.json')
  let config = await fse.readJson(configPath)

  if (!config || !config.gitAccount || !config.gitPassword) {
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

    config = {
      gitAccount,
      gitPassword
    }
    await fse.writeFileSync(configPath, JSON.stringify(config))
  }



  const {
    projectName,
    dockerSpace,
  } = await inquirer.prompt([{
    name: 'projectName',
    message: '请输入项目名称'
  }, {
      name: 'dockerSpace',
      message: '请输入镜像空间名称'
  }])

  resolve({
    templateName,
    projectName,
    dockerSpace,
    config,
    ...TMPS.templates[templateName],
  })
}