const inquirer = require('inquirer')
const fse = require('fs-extra')
const Path = require('path')

const tip = require('../tip')

module.exports = async () => {

  const { templateName } = await inquirer.prompt([{
    name: 'templateName',
    message: '请输入模板名称'
  }])

  const filePath = Path.join(__dirname, `../../templates/${templateName}.js`)
  
  if (!templateName || !fse.pathExistsSync(filePath)) {
    tip.fail('模板不存在!')
    process.exit()
  }

  const { fileName } = await inquirer.prompt([{
    name: 'fileName',
    message: '请输入待生成的文件名称'
  }])

  const { stringFn, prompts } = require(filePath)

  const answer = await inquirer.prompt(prompts)

  fse.writeFileSync(Path.join(process.cwd(), `${fileName}.js`), stringFn(answer), 'utf-8')
  process.exit()

}