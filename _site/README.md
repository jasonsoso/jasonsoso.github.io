# Jason 个人主页

Jason的个人网站，基于 [Jekyll](https://jekyllrb.com/) 构建，部署于 [GitHub Pages](https://pages.github.com/)。

- 线上地址：[www.jasonsoso.com](https://www.jasonsoso.com)
- 技术博客：[tech.jasonsoso.com](http://tech.jasonsoso.com)
- 工具包：[tools.jasonsoso.com](http://tools.jasonsoso.com)

> A programmer, A web technology enthusiast, and A believer in openness, sharing, decentralization and freedom！

## 项目简介

这是一个单页式个人主页，采用 [Start Bootstrap - Agency](http://startbootstrap.com) 主题，包含以下板块：

| 板块 | 说明 |
|------|------|
| **Header** | 个人头像、简介与导航入口 |
| **Blog** | 外链至技术博客「Jason技术流水账」 |
| **Tools** | 外链至在线工具包「Jason工具包」 |
| **Dev Console** | 伪装成开发者终端的小游戏实验区（摸鱼专用） |
| **About** | 个人经历时间线 |
| **Contact** | 社交媒体与联系方式 |
| **Footer** | 版权信息与备案号 |

## 技术栈

- **静态站点生成**：Jekyll（Markdown 引擎：kramdown）
- **前端框架**：Bootstrap 3
- **JavaScript**：jQuery 1.11.0、Classie、cbpAnimatedHeader
- **图标字体**：Font Awesome
- **字体**：Google Fonts（Roboto Slab 等）
- **统计**：百度统计

## 目录结构

```
jasonsoso.github.io/
├── _config.yml          # 站点配置（标题、描述、社交链接、主题色等）
├── _layouts/
│   ├── default.html     # 主页面布局
│   ├── style.css        # CSS 合并入口
│   └── js.js            # JS 合并入口
├── _includes/
│   ├── head.html        # <head> 元信息与样式引用
│   ├── header.html      # 导航栏与首页头部
│   ├── blog.html        # 博客板块
│   ├── tools.html       # 工具包板块
│   ├── about.html       # 关于我板块
│   ├── contact.html     # 联系方式板块
│   ├── footer.html      # 页脚
│   ├── js.html          # 脚本引用与百度统计
│   ├── css/             # Bootstrap、Agency、Font Awesome 样式
│   └── js/              # jQuery、Bootstrap、Agency 脚本
├── index.html           # 首页（使用 default 布局）
├── style.css            # 样式合并输出（Jekyll 处理后）
├── js.js                # 脚本合并输出（Jekyll 处理后）
├── img/                 # 图片资源（头像、时间线图片、favicon 等）
├── fonts/               # Font Awesome 字体文件
├── CNAME                # 自定义域名：www.jasonsoso.com
└── baidu_verify_*.html  # 百度站长验证文件
```

## 本地开发

### 环境要求

- Ruby 3.x（含 gem）
- Jekyll、Bundler

### Windows 安装（推荐）

```powershell
# 1. 安装 Ruby（含 MSYS2 开发工具，便于编译 gem 依赖）
winget install RubyInstallerTeam.RubyWithDevKit.3.3

# 2. 关闭并重新打开终端，使 PATH 生效，然后安装 Jekyll
gem install jekyll bundler

# 3. 进入项目目录并启动本地服务
cd jasonsoso.github.io
jekyll serve
```

安装完成后可在浏览器访问 http://localhost:4000

> 若提示 `gem: command not found`，说明 Ruby 未加入 PATH 或终端未重启。可手动执行：
> `$env:Path = "C:\Ruby33-x64\bin;" + $env:Path`

### macOS / Linux 安装与运行

```bash
# 克隆仓库
git clone https://github.com/jasonsoso/jasonsoso.github.io.git
cd jasonsoso.github.io

# 安装 Jekyll（若尚未安装）
gem install jekyll bundler

# 启动本地服务
jekyll serve

# 浏览器访问 http://localhost:4000
```

构建产物默认输出至 `_site/` 目录。

## Dev Console（小游戏）

主页 `#games` 区块提供四款伪装成开发工具的小游戏，游戏脚本按需懒加载，不影响博客首屏性能。

| 游戏 | 伪装名 | 操作 |
|------|--------|------|
| Code Typer | `type.js` | 打字代码片段，计 WPM |
| Terminal Snake | `snake.js` | 方向键 / 触摸 D-pad |
| Merge Diff | `2048.diff` | 方向键 / 滑动合并 |
| Debug Grid | `debug.grid` | 左键翻开，右键或长按标记 |

**快捷键**

- `Esc` — 退出游戏
- `Ctrl+Shift+B` — Boss 模式（切换至伪装技术博客页面）
- `?` — 显示快捷键帮助

本地最高分保存在 `localStorage`。

## 配置说明

主要配置位于 `_config.yml`：

```yaml
url: jasonsoso.com
title: Jason
email: 648636045@qq.com
description: "A programmer, A web technology enthusiast, ..."

color:
  primary: fed136      # 主题主色
  secondary: fec503    # 主题辅色
  secondary-dark: 333  # 深色文字

social:                # 社交链接（Contact 与 Footer 共用）
  - title: github
    url: http://github.com/jasonsoso
  - title: weibo
    url: http://weibo.com/tanjianna
  - title: envelope
    url: mailto:648636045@qq.com
  - title: qq
    url: http://wpa.qq.com/msgrd?v=3&uin=648636045&site=qq&menu=yes
```

修改站点信息、主题色或社交链接后，重新构建即可生效。

## 部署

本项目通过 GitHub Pages 自动部署：

1. 将代码推送至 `master` 分支
2. GitHub Pages 自动构建并发布
3. 自定义域名通过 `CNAME` 文件指向 `www.jasonsoso.com`

## 许可证

前端主题 [Agency](http://startbootstrap.com) 基于 [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0) 授权。

---

Copyright © Jason 2015–2026 · [粤ICP备2026067889号](https://beian.miit.gov.cn/)
