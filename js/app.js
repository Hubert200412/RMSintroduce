// 网站交互功能
document.addEventListener('DOMContentLoaded', function() {
  // ====== 社交二维码弹窗功能 ======
  // 1. 读取二维码配置
  let qrcodeData = [
    {icon: 'fab fa-weixin', label: '瑞德库普视频号', img: 'img/qrcode-weixin-video.jpg', social: 'weixin'},
    {icon: 'fab fa-weibo', label: '瑞德库普公众号', img: 'img/qrcode-weixin-public.jpg', social: 'weibo'},
    {icon: 'fab fa-qq', label: '鸿天集团视频号', img: 'img/qrcode-weibo-video.jpg', social: 'qq'}
    // 可扩展更多
  ];
  // 2. 生成弹窗DOM
  function createQrcodePopup(items) {
    const popup = document.createElement('div');
    popup.className = 'qrcode-popup';
    const inner = document.createElement('div');
    inner.className = 'qrcode-popup-inner';
    items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'qrcode-item';
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.label;
      const label = document.createElement('div');
      label.className = 'qrcode-label';
      label.textContent = item.label;
      itemDiv.appendChild(img);
      itemDiv.appendChild(label);
      inner.appendChild(itemDiv);
    });
    popup.appendChild(inner);
    return popup;
  }

  // 3. 绑定事件
  document.querySelectorAll('.social-links').forEach(socialLinks => {
    // 只生成一次弹窗
    let popup = null;
    let hideTimer = null;
    // 监听每个icon
    socialLinks.querySelectorAll('.social-icon').forEach(icon => {
      icon.addEventListener('mouseenter', function() {
        clearTimeout(hideTimer); // 修复切换时闪烁
        const type = icon.getAttribute('data-social');
        const items = qrcodeData.filter(q => q.social === type);
        if (!items.length) return;
        if (popup) popup.remove();
        popup = createQrcodePopup(items);
        socialLinks.appendChild(popup);
        setTimeout(() => popup.classList.add('active'), 10);
        // 悬停弹窗时不消失
        popup.addEventListener('mouseenter', function() {
          clearTimeout(hideTimer);
        });
        popup.addEventListener('mouseleave', function() {
          if (popup) {
            popup.classList.remove('active');
            hideTimer = setTimeout(() => { popup && popup.remove(); popup = null; }, 400);
          }
        });
      });
      icon.addEventListener('mouseleave', function() {
        if (popup) {
          popup.classList.remove('active');
          hideTimer = setTimeout(() => { popup && popup.remove(); popup = null; }, 400);
        }
      });
    });
  });
  // 设置导航活跃状态
  setActiveNavigation();
  
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

      // 追踪表单提交事件
      if (window.RMSAnalytics) {
        RMSAnalytics.trackCustomEvent('form_submit_attempt', {
          formType: 'contact',
          hasName: !!name,
          hasPhone: !!phone,
          timestamp: Date.now()
        });
      }
      
      // 模拟提交成功
      showNotification('咨询信息已提交，我们会尽快联系您！', 'success');
      this.reset();

      // 追踪成功提交
      if (window.RMSAnalytics) {
        RMSAnalytics.trackCustomEvent('form_submit_success', {
          formType: 'contact',
          timestamp: Date.now()
        });
      }
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
    // 移除transform避免影响fixed定位
    // document.body.style.transform = 'translateY(0)';
  }, 100);

  // 咨询弹出框交互
  const consultBtn = document.querySelector('#consultBtn');
  const consultPopup = document.querySelector('#consultPopup');
  
  if (consultBtn && consultPopup) {
    // 点击"预约演示"项跳转到指定页面
    const scheduleItem = consultPopup.querySelector('.popup-item:first-child');
    if (scheduleItem) {
      scheduleItem.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = 'inquiry.html#system-experience';
        
        // 追踪点击事件
        if (window.RMSAnalytics) {
          RMSAnalytics.trackCustomEvent('consult_popup_click', {
            action: 'schedule_demo',
            timestamp: Date.now()
          });
        }
      });
    }

    // 点击电话咨询项
    const phoneItem = consultPopup.querySelector('.popup-item:nth-child(2)');
    if (phoneItem) {
      phoneItem.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // 追踪点击事件
        if (window.RMSAnalytics) {
          RMSAnalytics.trackCustomEvent('consult_popup_click', {
            action: 'phone_consult',
            timestamp: Date.now()
          });
        }
      });
    }

    // 点击帮助中心项
    const helpItem = consultPopup.querySelector('.popup-item:nth-child(3)');
    if (helpItem) {
      helpItem.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // 追踪点击事件
        if (window.RMSAnalytics) {
          RMSAnalytics.trackCustomEvent('consult_popup_click', {
            action: 'help_center',
            timestamp: Date.now()
          });
        }
      });
    }

    // 阻止弹出框内的点击事件冒泡
    consultPopup.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // 点击按钮外的区域隐藏弹出框 - 优化版本
    document.addEventListener('click', function(e) {
      if (!consultBtn.contains(e.target) && !consultPopup.contains(e.target)) {
        consultPopup.style.opacity = '0';
        consultPopup.style.visibility = 'hidden';
        consultPopup.style.transform = 'translateY(-50%) translateX(0)';
      }
    });

    // ESC键隐藏弹出框
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        consultPopup.style.opacity = '0';
        consultPopup.style.visibility = 'hidden';
        consultPopup.style.transform = 'translateY(-50%) translateX(0)';
      }
    });
  }
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

// 设置导航活跃状态
function setActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    // 检查链接是否匹配当前页面
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage === 'inquiry.html' && linkHref === 'inquiry.html')) {
      link.classList.add('active');
    }
  });
}
