class AnimatedBackground {
  constructor() {
    this.icons = [
      'fa-shopping-cart', 'fa-cash-register', 'fa-users',
      'fa-handshake', 'fa-trophy', 'fa-cogs',
      'fa-shield-alt', 'fa-heart', 'fa-star', 'fa-comments',
      'fa-envelope', 'fa-phone',
      'fa-dollar-sign','fa-thumbs-up'
    ];
  }

  init() {
    this.createBackground();
    this.generateIcons();
  }

  createBackground() {
    // 创建页面背景装饰
    const pageDecoration = document.createElement('div');
    pageDecoration.className = 'page-background-decoration';
    document.body.appendChild(pageDecoration);
    
    // 创建动态图标背景容器
    const bgContainer = document.createElement('div');
    bgContainer.className = 'animated-background';
    
    const iconsContainer = document.createElement('div');
    iconsContainer.className = 'floating-icons';
    
    bgContainer.appendChild(iconsContainer);
    document.body.appendChild(bgContainer);
    
    this.container = iconsContainer;
  }

  generateIcons() {
    // 创建10个图标元素 (基于example的数量)
    for (let i = 1; i <= 20; i++) {
      this.createIcon(i);
    }
  }

  createIcon(index) {
    const icon = document.createElement('i');
    const randomIcon = this.icons[Math.floor(Math.random() * this.icons.length)];
    
    icon.className = `floating-icon fas ${randomIcon}`;
    
    // 根据index决定是前景还是背景，模仿example的逻辑
    if (index % 2 === 1 && index <= 8) {
      icon.classList.add('Foreground');
      // 前景图标使用更亮的橙色
      icon.style.color = `rgba(255, 107, 0, ${0.1 + Math.random() * 0.05})`;
      icon.style.textShadow = '0 0 12px rgba(255, 107, 0, 0.4)';
    } else {
      icon.classList.add('Background');
      // 背景图标使用较淡的橙色
      icon.style.color = `rgba(255, 165, 0, ${0.06 + Math.random() * 0.04})`;
      icon.style.textShadow = '0 0 8px rgba(255, 140, 0, 0.2)';
    }
    
    // 设置图标的内容 (FontAwesome图标通过CSS类显示)
    this.container.appendChild(icon);
  }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
  const animatedBg = new AnimatedBackground();
  animatedBg.init();
});
