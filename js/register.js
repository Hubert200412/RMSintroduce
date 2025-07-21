// 注册页面交互功能
document.addEventListener('DOMContentLoaded', function() {
  let currentStep = 1;
  const totalSteps = 4;
  let registrationData = {
    industry: '',
    businessType: '',
    scale: '',
    stage: '',
    needs: [],
    phone: '',
    password: '',
    merchantName: '',
    contactName: ''
  };

  // 初始化
  initializeRegistration();

  function initializeRegistration() {
    // 步骤1: 行业选择
    initIndustrySelection();
    
    // 步骤2: 商户信息
    initBusinessInfo();
    
    // 步骤3: 经营需求
    initNeedsSelection();
    
    // 步骤4: 账户设置
    initAccountSetup();
    
    // 按钮事件
    initButtonEvents();
    
    // 验证码功能
    initVerificationCode();
    
    // 设置初始背景
    updateBackground(1);
  }

  // 步骤1: 行业选择
  function initIndustrySelection() {
    const industryItems = document.querySelectorAll('.industry-item');
    
    industryItems.forEach(item => {
      item.addEventListener('click', function() {
        // 移除其他选中状态
        industryItems.forEach(i => i.classList.remove('selected'));
        
        // 添加当前选中状态
        this.classList.add('selected');
        
        // 保存选择
        registrationData.industry = this.dataset.industry;
        
        // 启用下一步按钮
        updateNextButton(1, true);
        
        // 追踪事件
        trackEvent('industry_selected', { industry: registrationData.industry });
      });
    });
  }

  // 步骤2: 商户信息
  function initBusinessInfo() {
    // 经营模式选择
    const businessTypeRadios = document.querySelectorAll('input[name="business-type"]');
    businessTypeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        registrationData.businessType = this.value;
        checkStep2Completion();
        trackEvent('business_type_selected', { type: this.value });
      });
    });

    // 门店规模选择
    const scaleItems = document.querySelectorAll('.scale-item');
    scaleItems.forEach(item => {
      item.addEventListener('click', function() {
        scaleItems.forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
        registrationData.scale = this.dataset.scale;
        checkStep2Completion();
        trackEvent('scale_selected', { scale: registrationData.scale });
      });
    });

    // 发展阶段选择
    const stageItems = document.querySelectorAll('.stage-item');
    stageItems.forEach(item => {
      item.addEventListener('click', function() {
        stageItems.forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
        registrationData.stage = this.dataset.stage || this.textContent.trim();
        checkStep2Completion();
        trackEvent('stage_selected', { stage: registrationData.stage });
      });
    });
  }

  function checkStep2Completion() {
    const isComplete = registrationData.businessType && 
                      registrationData.scale && 
                      registrationData.stage;
    updateNextButton(2, isComplete);
  }

  // 步骤3: 经营需求
  function initNeedsSelection() {
    const needItems = document.querySelectorAll('.need-item');
    
    needItems.forEach(item => {
      item.addEventListener('click', function() {
        const needId = this.dataset.need;
        
        if (this.classList.contains('selected')) {
          // 取消选择
          this.classList.remove('selected');
          registrationData.needs = registrationData.needs.filter(need => need !== needId);
        } else {
          // 添加选择
          this.classList.add('selected');
          registrationData.needs.push(needId);
        }
        
        // 至少选择一个需求才能进入下一步
        updateNextButton(3, registrationData.needs.length > 0);
        
        trackEvent('need_selected', { 
          need: needId, 
          selected: this.classList.contains('selected'),
          totalSelected: registrationData.needs.length 
        });
      });
    });
  }

  // 步骤4: 账户设置
  function initAccountSetup() {
    const phoneInput = document.querySelector('.phone-input');
    const passwordInput = document.querySelector('.password-input');
    const merchantNameInput = document.querySelector('input[placeholder*="餐厅名称"]');
    const contactNameInput = document.querySelector('input[placeholder*="联系人姓名"]');
    const termsCheckbox = document.querySelector('#termsCheckbox');
    
    // 手机号验证
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        registrationData.phone = this.value;
        checkStep4Completion();
      });
    }

    // 密码强度检测
    if (passwordInput) {
      passwordInput.addEventListener('input', function() {
        registrationData.password = this.value;
        updatePasswordStrength(this.value);
        checkStep4Completion();
      });
    }

    // 密码显示切换
    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
      passwordToggle.addEventListener('click', function() {
        const input = passwordInput;
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    }

    // 商户名称
    if (merchantNameInput) {
      merchantNameInput.addEventListener('input', function() {
        registrationData.merchantName = this.value;
        checkStep4Completion();
      });
    }

    // 联系人姓名
    if (contactNameInput) {
      contactNameInput.addEventListener('input', function() {
        registrationData.contactName = this.value;
        checkStep4Completion();
      });
    }

    // 协议同意
    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', function() {
        checkStep4Completion();
      });
    }
  }

  function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;

    let strength = 0;
    let strengthLabel = '弱';
    
    // 检查密码强度
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // 移除旧的强度类
    strengthBar.classList.remove('weak', 'medium', 'strong');
    
    if (strength <= 2) {
      strengthBar.classList.add('weak');
      strengthLabel = '弱';
    } else if (strength <= 3) {
      strengthBar.classList.add('medium');
      strengthLabel = '中';
    } else {
      strengthBar.classList.add('strong');
      strengthLabel = '强';
    }
    
    strengthText.textContent = `密码强度：${strengthLabel}`;
  }

  function checkStep4Completion() {
    const phoneValid = registrationData.phone && registrationData.phone.length === 11;
    const passwordValid = registrationData.password && registrationData.password.length >= 8;
    const merchantNameValid = registrationData.merchantName && registrationData.merchantName.trim();
    const contactNameValid = registrationData.contactName && registrationData.contactName.trim();
    const termsChecked = document.querySelector('#termsCheckbox').checked;
    
    const isComplete = phoneValid && passwordValid && merchantNameValid && contactNameValid && termsChecked;
    
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = !isComplete;
    }
  }

  // 按钮事件
  function initButtonEvents() {
    // 下一步按钮
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('btn-next')) {
        nextStep();
      }
    });

    // 上一步按钮
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('btn-prev')) {
        prevStep();
      }
    });

    // 提交按钮
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('btn-submit')) {
        submitRegistration();
      }
    });
  }

  function nextStep() {
    if (currentStep < totalSteps) {
      hideStep(currentStep);
      currentStep++;
      showStep(currentStep);
      updateProgressBar();
      trackEvent('step_next', { step: currentStep });
      // 滚动到表单顶部
      scrollToTop();
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      hideStep(currentStep);
      currentStep--;
      showStep(currentStep);
      updateProgressBar();
      trackEvent('step_prev', { step: currentStep });
      // 滚动到表单顶部
      scrollToTop();
    }
  }

  function showStep(step) {
    const stepElement = document.getElementById(`step${step}`);
    if (stepElement) {
      stepElement.classList.add('active');
    }
    
    // 更新背景图片
    updateBackground(step);
  }

  function hideStep(step) {
    const stepElement = document.getElementById(`step${step}`);
    if (stepElement) {
      stepElement.classList.remove('active');
    }
  }

  // 更新背景图片
  function updateBackground(step) {
    const registerSection = document.querySelector('.register-section');
    if (registerSection) {
      // 移除所有步骤类
      registerSection.classList.remove('step-1', 'step-2', 'step-3', 'step-4');
      // 添加当前步骤类
      registerSection.classList.add(`step-${step}`);
    }
  }

  function updateProgressBar() {
    // 更新进度步骤状态
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    
    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      
      step.classList.remove('active', 'completed');
      
      if (stepNumber < currentStep) {
        step.classList.add('completed');
      } else if (stepNumber === currentStep) {
        step.classList.add('active');
      }
    });

    // 更新进度线
    progressLines.forEach((line, index) => {
      line.classList.remove('completed');
      if (index + 1 < currentStep) {
        line.classList.add('completed');
      }
    });
  }

  function updateNextButton(step, enabled) {
    const stepElement = document.getElementById(`step${step}`);
    if (stepElement) {
      const nextBtn = stepElement.querySelector('.btn-next');
      if (nextBtn) {
        nextBtn.disabled = !enabled;
      }
    }
  }

  // 验证码功能
  function initVerificationCode() {
    const getCodeBtn = document.getElementById('getCodeBtn');
    if (getCodeBtn) {
      getCodeBtn.addEventListener('click', function() {
        const phoneInput = document.querySelector('.phone-input');
        const phone = phoneInput ? phoneInput.value : '';
        
        if (!phone || phone.length !== 11) {
          showNotification('请输入正确的手机号码', 'error');
          return;
        }
        
        // 开始倒计时
        startCountdown(this);
        
        // 模拟发送验证码
        setTimeout(() => {
          showNotification('验证码已发送至您的手机', 'success');
        }, 500);
        
        trackEvent('verification_code_sent', { phone: phone });
      });
    }
  }

  function startCountdown(btn) {
    let count = 60;
    btn.disabled = true;
    btn.textContent = `${count}秒后重新获取`;
    
    const timer = setInterval(() => {
      count--;
      btn.textContent = `${count}秒后重新获取`;
      
      if (count <= 0) {
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = '获取验证码';
      }
    }, 1000);
  }

  // 提交注册
  function submitRegistration() {
    // 验证所有必填信息
    if (!validateRegistrationData()) {
      return;
    }

    // 显示提交中状态
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '注册中...';

    // 模拟提交过程
    setTimeout(() => {
      // 模拟成功
      showNotification('注册成功！正在跳转到登录页面...', 'success');
      
      trackEvent('registration_completed', registrationData);
      
      // 跳转到登录页面
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    }, 2000);
  }

  function validateRegistrationData() {
    const verificationInput = document.querySelector('.verification-input');
    const verificationCode = verificationInput ? verificationInput.value : '';
    
    if (!verificationCode || verificationCode.length !== 6) {
      showNotification('请输入6位验证码', 'error');
      return false;
    }
    
    if (!registrationData.phone || registrationData.phone.length !== 11) {
      showNotification('请输入正确的手机号码', 'error');
      return false;
    }
    
    if (!registrationData.password || registrationData.password.length < 8) {
      showNotification('密码长度至少8位', 'error');
      return false;
    }
    
    if (!registrationData.merchantName || !registrationData.contactName) {
      showNotification('请填写完整的商户信息', 'error');
      return false;
    }
    
    return true;
  }

  // 通知系统
  function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
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
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 350px;
      word-wrap: break-word;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动移除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // 滚动到表单顶部
  function scrollToTop() {
    const registerContainer = document.querySelector('.register-container');
    if (registerContainer) {
      registerContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // 如果找不到容器，则滚动到页面顶部
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  }

  // 事件追踪
  function trackEvent(eventName, data) {
    if (window.RMSAnalytics) {
      RMSAnalytics.trackCustomEvent(eventName, {
        ...data,
        timestamp: Date.now(),
        page: 'register'
      });
    }
    console.log('Event tracked:', eventName, data);
  }
});
