// 网站交互功能
document.addEventListener('DOMContentLoaded', function() {
  // 移动端导航菜单切换
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      // 切换汉堡菜单动画
      navToggle.classList.toggle('active');
    });

    // 点击菜单项时关闭移动端菜单
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // 平滑滚动到锚点
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 返回顶部按钮
  const backToTop = document.querySelector('.back-to-top');
  
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 导航栏滚动效果
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      navbar.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
      navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    }
    
    lastScrollTop = scrollTop;
  });

  // 表单提交处理
  const contactForm = document.querySelector('.contact-form form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 获取表单数据
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // 简单的表单验证
      const name = this.querySelector('input[type="text"]').value;
      const phone = this.querySelector('input[type="tel"]').value;
      
      if (!name || !phone) {
        showNotification('请填写必要信息', 'error');
        return;
      }
      
      // 模拟提交成功
      showNotification('咨询信息已提交，我们会尽快联系您！', 'success');
      this.reset();
    });
  }

  // 为卡片添加hover效果
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loading');
      }
    });
  }, observerOptions);

  // 观察所有卡片元素
  document.querySelectorAll('.capability-item, .solution-card, .case-card').forEach(card => {
    observer.observe(card);
  });

  // 设备图标动画
  const deviceIcons = document.querySelectorAll('.app-icon');
  deviceIcons.forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.1}s`;
    icon.classList.add('floating');
  });

  // 统计数字动画
  function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // 格式化数字显示
      if (target >= 1000000) {
        element.textContent = (current / 1000000).toFixed(1) + '万+';
      } else if (target >= 1000) {
        element.textContent = (current / 1000).toFixed(1) + 'k+';
      } else if (target >= 100) {
        element.textContent = Math.round(current) + '%';
      } else {
        element.textContent = Math.round(current) + '%';
      }
    }, 16);
  }

  // 当统计数字进入视口时开始动画
  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numberElement = entry.target;
        const text = numberElement.textContent;
        let targetNumber = parseInt(text);
        
        if (text.includes('%')) {
          targetNumber = parseInt(text);
        }
        
        animateNumber(numberElement, targetNumber);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
  });

  // 咨询按钮点击效果
  document.querySelectorAll('.consult-item').forEach(item => {
    item.addEventListener('click', function() {
      if (this.textContent.includes('合作咨询')) {
        // 滚动到联系表单
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (this.textContent.includes('关注我们')) {
        // 显示二维码或社交媒体链接
        showNotification('扫描二维码关注我们的微信公众号', 'info');
      }
    });
  });

  // 添加页面加载动画
  document.body.classList.add('loading');
  
  // 延迟显示页面内容
  setTimeout(() => {
    document.body.style.opacity = '1';
    document.body.style.transform = 'translateY(0)';
  }, 100);
});

// 通知系统
function showNotification(message, type = 'info') {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // 添加样式
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  // 添加到页面
  document.body.appendChild(notification);
  
  // 显示动画
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // 自动移除
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// 页面性能优化
window.addEventListener('load', function() {
  // 预加载关键资源
  const preloadLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
  ];
  
  preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  });
});

// 添加一些交互效果
document.addEventListener('mousemove', function(e) {
  // 鼠标跟随效果（可选）
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

// 键盘快捷键支持
document.addEventListener('keydown', function(e) {
  // ESC键关闭移动端菜单
  if (e.key === 'Escape') {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  }
  
  // 回车键提交表单
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
    const form = e.target.closest('form');
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.click();
      }
    }
  }
});
