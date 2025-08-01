// 预约体验页面交互功能
document.addEventListener('DOMContentLoaded', function () {
  // 初始化页面功能
  initTabSwitching();
  initFormHandling();
  initScrollAnimations();
  initParticles();
  initCarousel();
  initAnimatedText(); // 添加动态文字效果

  // 追踪页面访问
  if (window.RMSAnalytics) {
    RMSAnalytics.trackCustomEvent('page_view', {
      page: 'inquiry',
      timestamp: Date.now()
    });
  }
});

// 粒子效果
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const particles = [];

  // 设置画布大小
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 粒子类
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }

  // 创建粒子
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// 轮播功能
function initCarousel() {
  const slides = document.getElementById('carouselSlides');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;

  if (!slides || !indicators.length) return;

  // 切换到指定幻灯片
  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    slides.style.transform = `translateX(-${currentSlide * 25}%)`;

    // 更新指示器
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }

  // 指示器点击事件
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // 自动轮播
  setInterval(() => {
    currentSlide = (currentSlide + 1) % 4;
    goToSlide(currentSlide);
  }, 4000);
}

// 标签页切换功能
function initTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      // 移除所有活跃状态
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // 添加活跃状态
      this.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      // 追踪标签页切换
      if (window.RMSAnalytics) {
        RMSAnalytics.trackCustomEvent('tab_switch', {
          tab: targetTab,
          timestamp: Date.now()
        });
      }
    });
  });
}

// 表单处理功能
function initFormHandling() {
  const form = document.getElementById('inquiryForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // 表单验证
      if (validateForm()) {
        submitForm();
      }
    });

    // 实时验证
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function () {
        validateField(this);
      });

      input.addEventListener('input', function () {
        clearFieldError(this);
      });
    });
  }
}

// 表单验证
function validateForm() {
  const form = document.getElementById('inquiryForm');
  let isValid = true;

  // 必填字段验证
  const requiredFields = [
    { name: 'contactName', message: '请输入联系人姓名' },
    { name: 'contactPhone', message: '请输入联系电话' },
    { name: 'storeCount', message: '请选择门店规模' },
    { name: 'agreeTerms', message: '请同意服务条款和隐私政策' }
  ];

  requiredFields.forEach(field => {
    const element = form.querySelector(`[name="${field.name}"]`);
    if (!element.value || (field.name === 'agreeTerms' && !element.checked)) {
      showFieldError(element, field.message);
      isValid = false;
      // 针对未勾选协议，显示动态图片指向勾选框
      if (field.name === 'agreeTerms' && !element.checked) {
        showAgreementPointer(element);
      }
    }
  });

  return isValid;
}

// 单个字段验证
function validateField(field) {
  const fieldName = field.getAttribute('name');
  let isValid = true;

  // 必填字段检查
  if (field.hasAttribute('required') && !field.value) {
    showFieldError(field, `请填写${field.previousElementSibling.textContent.replace(' *', '')}`);
    isValid = false;
  }

  // 手机号格式校验
  if (fieldName === 'contactPhone' && field.value && !/^\d{11}$/.test(field.value)) {
    showFieldError(field, '请输入11位数字的手机号码');
    isValid = false;
  }
  if (isValid) {
    clearFieldError(field);
  }
  return isValid;
}

// 显示字段错误
// 显示动态图片指向协议勾选框
function showAgreementPointer(checkbox) {
  // 检查是否已存在指示图片
  if (document.getElementById('agreement-pointer-img')) return;
  const pointerImg = document.createElement('img');
  pointerImg.id = 'agreement-pointer-img';
  pointerImg.src = 'img/inquiry1.jpg'; // 请将指示图片放在 img 目录下
  pointerImg.alt = '请勾选';
  pointerImg.style.cssText = `
    position: absolute;
    left: -40px;
    top: 50%;
    width: 32px;
    height: 32px;
    transform: translateY(-50%);
    z-index: 20;
    pointer-events: none;
    animation: pointerMove 1s infinite alternate;
  `;
  // 父元素需定位
  const parent = checkbox.parentNode;
  if (window.getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }
  parent.appendChild(pointerImg);
  // 动画样式
  if (!document.getElementById('pointer-anim-style')) {
    const style = document.createElement('style');
    style.id = 'pointer-anim-style';
    style.textContent = `
      @keyframes pointerMove {
        0% { left: -40px; }
        100% { left: -10px; }
      }
    `;
    document.head.appendChild(style);
  }
  // 3秒后自动移除
  setTimeout(() => {
    if (pointerImg.parentNode) pointerImg.parentNode.removeChild(pointerImg);
  }, 3000);
}
function showFieldError(field, message) {
  clearFieldError(field);
  field.style.borderColor = '#dc3545';
  // 确保父元素有定位属性
  if (field.parentNode && window.getComputedStyle(field.parentNode).position === 'static') {
    field.parentNode.style.position = 'relative';
  }
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.style.cssText = `
    color: #dc3545;
    font-size: 0.85rem;
    position: absolute;
    left: 0;
    top: calc(100% + 4px);
    white-space: nowrap;
    pointer-events: none;
    animation: fadeIn 0.3s ease;
    z-index: 10;
  `;
  errorDiv.textContent = message;
  field.parentNode.appendChild(errorDiv);
}

// 清除字段错误
function clearFieldError(field) {
  field.style.borderColor = '#e1e5e9';

  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
}

// 提交表单
function submitForm() {
  const form = document.getElementById('inquiryForm');
  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;

  // 显示提交状态
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
  submitBtn.disabled = true;

  // 收集表单数据
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // 追踪表单提交尝试
  if (window.RMSAnalytics) {
    RMSAnalytics.trackCustomEvent('inquiry_form_submit_attempt', {
      storeCount: data.storeCount,
      businessType: data.businessType || 'not_specified',
      timestamp: Date.now()
    });
  }

  // 模拟提交过程
  setTimeout(() => {
    // 模拟成功提交
    showSuccessMessage();

    // 重置表单
    form.reset();

    // 恢复按钮状态
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // 追踪成功提交
    if (window.RMSAnalytics) {
      RMSAnalytics.trackCustomEvent('inquiry_form_submit_success', {
        timestamp: Date.now()
      });
    }

    // 发送到服务器的代码可以在这里添加
    // fetch('/api/inquiry', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })

  }, 2000);
}

// 显示成功消息
function showSuccessMessage() {
  const message = document.createElement('div');
  message.className = 'success-message';
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideIn 0.5s ease;
  `;
  message.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-check-circle"></i>
      <span>预约申请已提交成功！我们会尽快联系您。</span>
    </div>
  `;

  document.body.appendChild(message);

  // 3秒后自动移除
  setTimeout(() => {
    message.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 500);
  }, 3000);
}

// 滚动动画
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
      }
    });
  }, observerOptions);

  // 观察需要动画的元素
  const animatedElements = document.querySelectorAll(
    '.feature-item, .advantage-item, .form-wrapper'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
  });
}

// 设备展示动画
function startDeviceAnimation() {
  const appIcons = document.querySelectorAll('.app-icon');

  appIcons.forEach((icon, index) => {
    setInterval(() => {
      icon.style.transform = `scale(${0.9 + Math.random() * 0.2})`;
      setTimeout(() => {
        icon.style.transform = 'scale(1)';
      }, 200);
    }, 3000 + index * 1000);
  });
}

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// 启动设备动画
setTimeout(startDeviceAnimation, 1000);

// 平滑滚动到表单
function scrollToForm() {
  const formSection = document.querySelector('.inquiry-form-section');
  if (formSection) {
    formSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// 如果URL包含特定参数，自动滚动到表单
if (window.location.hash === '#form' || window.location.search.includes('scroll=form')) {
  setTimeout(scrollToForm, 1000);
}

function initAnimatedText() {
  const textFragments = document.querySelectorAll('.text-fragment');
  // 为每个文字片段设置延迟
  textFragments.forEach((fragment, index) => {
    fragment.style.setProperty('--delay', index);
  });
}

// Swiper初始化，确保依赖加载后再执行
document.addEventListener('DOMContentLoaded', function () {
  if (typeof Swiper !== 'undefined') {
    console.log('Swiper is loaded, initializing gallery...');
    var galleryThumbs = new Swiper(".gallery-thumbs", {
      centeredSlides: true,
      centeredSlidesBounds: true,
      slidesPerView: 3,
      watchOverflow: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      direction: 'vertical'
    });

    var galleryMain = new Swiper(".gallery-main", {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      allowTouchMove: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: galleryThumbs
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      }
    });

    // 点击缩略图切换主图
    galleryThumbs.on('click', function () {
      galleryMain.slideTo(galleryThumbs.clickedIndex);
      // 重置自动切换计时器
      if (galleryMain.autoplay && typeof galleryMain.autoplay.start === 'function') {
        galleryMain.autoplay.stop();
        galleryMain.autoplay.start();
      }
      console.log('Thumbnail clicked:', galleryThumbs.clickedIndex);
    });
    // 主图切换时同步缩略图
    galleryMain.on('slideChangeTransitionStart', function () {
      galleryThumbs.slideTo(galleryMain.activeIndex);
    });
    galleryThumbs.on('transitionStart', function () {
      galleryMain.slideTo(galleryThumbs.activeIndex);
    });
  }
});