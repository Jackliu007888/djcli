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

module.exports = async () => {

  const { templateName } = await inquirer.prompt([{
    name: 'templateName',
    message: '请输入模板名称'
  }])

  if (!templateName || !TMPS.templates[templateName]) {
    tip.fail('模板不存在!')
    process.exit()
  }

  const {
    url,
    branch,
    replace: {
      variables = {},
      paths = [],
    } = {}
  } = TMPS.templates[templateName]

  const baseVariables = {
    "projectName": "项目名称",
    "spaceName": "微服务空间名",
    "k8sServerName": "服务名",
    "dockerRegistryNamespace": "docker空间名"
  }

  const variablesResult = {
    ...variables,
    ...baseVariables,
  } 
  const answer = await inquirer.prompt(Object.keys(variablesResult).map(key => ({
    name: key,
    message: '请输入' + variablesResult[key]
  })))


  const config = await fse.readJson(path.join(__dirname, '../../config.json'))

  // git命令，远程拉取项目并自定义项目名
  let cmdStr = ''
  if (config && config.gitAccount && config.gitPassword) {
    const [protocol, urlPath] = url.split('//')
    cmdStr = `git clone -b ${branch} ${protocol}//${config.gitAccount}:${config.gitPassword}@${urlPath} ${answer.projectName}`
  } else {
    cmdStr = `git clone -b ${branch} ${url} ${answer.projectName}`
  }
  
  console.log('执行命令：' + cmdStr)
  spinner.start()

  exec(cmdStr, (err) => {
    if (err) {
      console.log(err)
      tip.fail('请重新运行!')
      process.exit()
    }
    // 删除 git 文件
    exec('cd ' + answer.projectName + ' && rm -rf .git', (err, out) => {
      execRm(err, answer.projectName)
    })
  })

  // TODO: 替换文件
}