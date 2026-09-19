# Wendy Li · Interactive CV

一个以落地风扇为主视觉的交互式个人履历网页。

## 使用方式

1. 拖动插头并插入插座。
2. 在页面任意空白区域按住鼠标左键，让风扇转动。
3. 点击扇叶查看对应经历。
4. 持续转动风扇可显示联系方式。

## GitHub Pages 部署

1. 在 GitHub 新建一个仓库。
2. 将本文件夹中的全部文件上传到仓库根目录。
3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment** 中选择 **Deploy from a branch**。
5. 选择 `main` 分支和 `/ (root)` 目录，然后保存。

网站随后会发布到 GitHub Pages 提供的地址。

## 文件结构

```text
index.html       页面结构
styles.css       主视觉样式
refinements.css  互动与细节样式
script.js        风扇、插头和经历交互
```

该项目不需要安装依赖或执行构建命令。
