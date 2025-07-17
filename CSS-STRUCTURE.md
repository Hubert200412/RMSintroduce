# CSS文件结构说明

## 文件组织

### 1. `css/common.css` - 通用样式文件
包含所有页面共用的样式：
- CSS重置和基础样式
- 导航栏样式
- 右侧滚动按钮组（合作咨询、关注我们、返回顶部）
- 页脚样式
- 通用按钮样式
- 通用section样式
- 通知样式
- 通用动画
- 滚动条样式
- 通用响应式适配

### 2. `css/home.css` - 首页专用样式
包含首页特有的样式：
- 主页横幅样式
- 设备展示样式
- 核心能力样式
- 解决方案样式
- 客户案例样式
- 联系我们样式
- 新闻动态样式
- 产品高亮样式
- 性能指示器
- 首页响应式适配

### 3. `css/inquiry.css` - 预约体验页面专用样式
包含预约体验页面特有的样式：
- 主横幅区域
- 设备展示区域
- 系统介绍区域
- 功能标签页
- 预约表单区域
- 为什么选择我们
- 预约页面特有的动画效果
- 预约页面响应式设计

## 优势

1. **代码复用**：通用样式只需维护一份
2. **易于维护**：每个文件职责明确，修改更容易
3. **加载优化**：只加载需要的样式文件
4. **扩展性好**：新增页面只需引入common.css + 页面专用css
5. **布局稳定**：固定宽度布局，内容不会因浏览器缩放而变形挤压
6. **视觉一致**：所有页面保持相同的布局结构和尺寸

## 使用方法

### 首页 (index.html)
```html
<link rel="stylesheet" href="css/common.css">
<link rel="stylesheet" href="css/home.css">
```

### 预约体验页 (inquiry.html)
```html
<link rel="stylesheet" href="css/common.css">
<link rel="stylesheet" href="css/inquiry.css">
```

### 新增页面
```html
<link rel="stylesheet" href="css/common.css">
<link rel="stylesheet" href="css/your-page.css">
```

## 注意事项

1. `common.css` 必须在页面专用CSS之前引入
2. 通用样式修改只需在 `common.css` 中进行
3. 页面特有样式在对应的专用CSS文件中修改
4. 原 `style.css` 已备份为 `style.css.backup`
5. **页面布局固定**：所有容器使用固定宽度(1200px)，不随浏览器缩放而变形
6. **响应式已禁用**：为防止内容挤压移动，已注释掉所有响应式样式
7. **最小宽度**：页面设置了最小宽度1240px，小于此宽度会出现横向滚动条

## 文件依赖关系

```
common.css (基础)
    ├── home.css (首页扩展)
    └── inquiry.css (预约页扩展)
```
