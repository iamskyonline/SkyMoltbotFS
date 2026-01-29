# 配置说明

为了使GitHub Actions能够唤醒您的Codespace，请按以下步骤操作：

## 1. 获取您的Codespace URL
您的Codespace URL格式为：
https://<your-codespace-name>-<port>.app.github.dev

例如：
https://probable-pancake-rp6j5x9gv9pcp65g-3000.app.github.dev

## 2. 添加密钥到GitHub仓库
1. 进入您的GitHub仓库
2. 点击 "Settings" 选项卡
3. 在左侧菜单中选择 "Secrets and variables" 
4. 点击 "Actions"
5. 点击 "New repository secret"
6. 添加以下密钥：
   - Name: `CODESPACE_URL`
   - Value: 您的Codespace完整URL

## 3. 验证配置
运行以下命令来验证URL是否正确：
curl -I https://<your-codespace-name>-<port>.app.github.dev

## 4. 启用工作流
工作流文件已经创建在 .github/workflows/wake-up-codespace-and-weather.yml
当您推送更改后，它将按计划运行。