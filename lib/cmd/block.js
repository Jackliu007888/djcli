const exec = require('child_process').exec
const ora = require('ora')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const Path = require('path')
const rimraf = require('rimraf')

const tip = require('../tip')
const TMPS = require('../../templates/block')

const spinner = ora('正在生成...')

module.exports = async () => {

  const { templateName } = await inquirer.prompt([{
    name: 'templateName',
    message: '请输入区块名称'
  }])

  if (!templateName || !TMPS.templates[templateName]) {
    tip.fail('区块不存在!')
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
  }

  const variablesResult = {
    ...variables,
    ...baseVariables,
  }

  const answer = await inquirer.prompt(Object.keys(variablesResult).map(key => ({
    name: key,
    message: '请输入' + variablesResult[key]
  })))

  const config = await fse.readJson(Path.join(__dirname, '../../config.json'))

  // git命令，远程拉取项目并自定义项目名
  let cmdStr = ''
  if (config && config.gitAccount && config.gitPassword) {
    const [protocol, urlPath] = url.split('//')
    cmdStr = `git clone -b ${branch} ${protocol}//${config.gitAccount}:${config.gitPassword}@${urlPath} ${templateName}`
  } else {
    cmdStr = `git clone -b ${branch} ${url} ${templateName}`
  }

  console.log('执行命令：' + cmdStr)
  spinner.start()

  exec(cmdStr, async (err) => {
    if (err) {
      console.log(err)
      tip.fail('请重新运行!')
      process.exit()
    }

    // 替换变量
    console.log('正在替换变量')
    await Promise.all(paths.map(async path => {
      const filePath = Path.join(process.cwd(), templateName, path)

      if (fse.pathExistsSync(filePath)) {
        const fileString = await fse.readFileSync(filePath, 'utf-8')
        const replacedFileString = Object.keys(variablesResult).reduce((prev, key) => {
          // eslint-disable-next-line
          return prev = prev.replace(new RegExp(`__${key}__`, 'g'), answer[key])
        }, fileString)
        await fse.writeFileSync(filePath, replacedFileString, 'utf-8')
      }
    }))

    // 删除 git 文件
    console.log('正在删除 git 文件')
    await rimraf(Path.join(process.cwd(), templateName, '.git'), function () {
      tip.suc('初始化完成！')
      process.exit()
    })
  })

}