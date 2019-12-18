# djcli 前端应用 脚手架

## 安装

```shell
git clone ...

npm i

npm link
```

## 命令

- 查看现有模板 `djcli l`

- 查看git配置 `djcli c`

- 设置git配置 `djcli sc`

- 初始化一个模板 `djcli init`

## 模板配置

形如以下形式

- replace 是需要替换变量的信息

- 在初始化项目的时候会提示输入，在git clone 之后对`replace.paths`下的文件进行替换

- replace.paths 默认为项目根路径

- 项目模板需要用 `$${变量名}$$` 写好在需要替换的文件中

```JSON
"eggjs": {
  "url": "https://gitlab.51zcm.cc/front/service",
  "branch": "test",
  "description": "eggjs S端模板",
  "replace": {
    "variables": {
      "spaceName": "微服务空间名",
      "k8sServerName": "服务名",
      "dockerRegistryNamespace": "docker空间名"
    },
    "paths": [
      "Jenkinsfile",
      "package.json",
      "build.sh"
    ]
  }
}
```
