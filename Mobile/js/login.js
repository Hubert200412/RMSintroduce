// 页面加载遮罩控制
document.addEventListener('DOMContentLoaded', function () {
  // 登录/注册tab切换
  var tabBtns = document.querySelectorAll('.tab-btn');
  var loginFormBox = document.getElementById('loginForm');
  var registerFormBox = document.getElementById('registerForm');
  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tabBtns.forEach(function(b){b.classList.remove('active');});
      this.classList.add('active');
      if(this.dataset.tab === 'login'){
        loginFormBox.style.display = '';
        registerFormBox.style.display = 'none';
      }else{
        loginFormBox.style.display = 'none';
        registerFormBox.style.display = '';
      }
    });
  });
  // 自动填充表单内容并清空storage
  fillLoginForm(true);
  // 协议链接点击时保存表单内容
  var policyLink = document.getElementById('policyLink');
  if (policyLink) {
    policyLink.addEventListener('click', function() {
      saveLoginForm();
    });
  }
// 仅在点击协议时存储表单内容
function saveLoginForm() {
  var merchant = document.getElementById('merchantInput')?.value || '';
  var phone = document.getElementById('login-phone')?.value || '';
  var code = document.getElementById('login-code')?.value || '';
  var password = document.getElementById('login-password')?.value || '';
  var remember = document.getElementById('rememberMe')?.checked || false;
  var terms = document.getElementById('termsCheckbox')?.checked || false;
  localStorage.setItem('loginFormCache', JSON.stringify({merchant, phone, code, password, remember, terms}));
}

// 页面加载时填充表单并清空storage
function fillLoginForm(clearAfterFill) {
  var cache = localStorage.getItem('loginFormCache');
  if (!cache) return;
  try {
    var data = JSON.parse(cache);
    if (data.merchant !== undefined) document.getElementById('merchantInput').value = data.merchant;
    if (data.phone !== undefined) document.getElementById('login-phone').value = data.phone;
    if (data.code !== undefined) document.getElementById('login-code').value = data.code;
    if (data.password !== undefined) document.getElementById('login-password').value = data.password;
    if (data.remember !== undefined) document.getElementById('rememberMe').checked = data.remember;
    if (data.terms !== undefined) document.getElementById('termsCheckbox').checked = data.terms;
  } catch(e) {}
  if(clearAfterFill) localStorage.removeItem('loginFormCache');
}
  setTimeout(function () {
    var main = document.getElementById('main-content');
    var mask = document.getElementById('page-loading-mask');
    if (main) main.style.display = '';
    if (mask) mask.style.display = 'none';
  }, 0);
});

// 表单交互逻辑
document.addEventListener('DOMContentLoaded', function () {
  // 记住我和协议初始化
  var rememberMe = document.getElementById('rememberMe');
  var termsCheckbox = document.getElementById('termsCheckbox');
  // 若URL参数agree=1，则自动勾选协议
  if (localStorage.getItem('termsAccepted') === 'true' ||
      (new URLSearchParams(window.location.search).get('agree') === '1')) {
    termsCheckbox.checked = true;
  }
  if (localStorage.getItem('rememberMe') === 'true') {
    rememberMe.checked = true;
    document.getElementById('merchantInput').value = localStorage.getItem('merchantGroup') || '';
    document.getElementById('login-phone').value = localStorage.getItem('phone') || '';
    document.getElementById('login-password').value = localStorage.getItem('password') || '';
  }
  rememberMe && rememberMe.addEventListener('click', function () {
    if (!this.checked) {
      localStorage.removeItem('merchantGroup');
      localStorage.removeItem('phone');
      localStorage.removeItem('password');
      localStorage.setItem('rememberMe', 'false');
    }
  });

  // 登录表单校验和交互
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var merchant = loginForm.merchant.value.trim();
    var phone = loginForm.phone.value.trim();
    var code = loginForm.code.value.trim();
    var pwd = loginForm.password.value.trim();
    if (!termsCheckbox.checked) {
      showMessage('请先同意用户协议和隐私政策', 'error');
      termsCheckbox.focus();
      return;
    }
    if (!merchant) {
      showMessage('请填写商家号', 'error');
      loginForm.merchant.focus();
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showMessage('请填写正确的手机号', 'error');
      loginForm.phone.focus();
      return;
    }
    if (!code || code.length !== 6) {
      showMessage('请输入6位验证码', 'error');
      loginForm.code.focus();
      return;
    }
    if (!pwd) {
      showMessage('请输入密码', 'error');
      loginForm.password.focus();
      return;
    }
    if (rememberMe.checked) {
      localStorage.setItem('rememberMe', true);
      localStorage.setItem('merchantGroup', merchant);
      localStorage.setItem('phone', phone);
      localStorage.setItem('password', pwd);
    }
    localStorage.setItem('termsAccepted', termsCheckbox.checked);
    showMessage('正在登录...', 'info');
    setTimeout(function () {
      showMessage('登录成功！正在跳转...', 'success');
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 1200);
    }, 800);
  });

  // 获取验证码功能（登录表单）
  var getCodeBtn = document.getElementById('getCodeBtn');
  var codeTimer = null, codeCount = 60;
  getCodeBtn && getCodeBtn.addEventListener('click', function () {
    var phone = loginForm.phone.value.trim();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showMessage('请先输入正确手机号', 'error');
      loginForm.phone.focus();
      return;
    }
    getCodeBtn.disabled = true;
    getCodeBtn.textContent = '已发送(60s)';
    codeCount = 60;
    codeTimer = setInterval(function () {
      codeCount--;
      getCodeBtn.textContent = '已发送(' + codeCount + 's)';
      if (codeCount <= 0) {
        clearInterval(codeTimer);
        getCodeBtn.disabled = false;
        getCodeBtn.textContent = '获取验证码';
      }
    }, 1000);
    showMessage('验证码已发送', 'success');
    // 这里可调用实际发送验证码API
  });

  // 手机号/验证码输入限制
  var phoneInput = document.getElementById('login-phone');
  phoneInput && phoneInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^\d]/g, '').slice(0, 11);
  });
  var codeInput = document.getElementById('login-code');
  codeInput && codeInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^\d]/g, '').slice(0, 6);
  });

  // 注册表单校验（保留原有逻辑）
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = registerForm.phone.value.trim();
    var pwd = registerForm.password.value.trim();
    var code = registerForm.code.value.trim();
    if (!/^1[3-9]\d{9}$/.test(phone) || !pwd || !code) {
      showMessage('请填写完整信息', 'error');
      return;
    }
    showMessage('注册成功（模拟）', 'success');
    registerForm.reset();
  });

  // 注册验证码倒计时（保留原有）
  var sendCodeBtn = document.getElementById('sendCodeBtn');
  var timer = null, count = 60;
  sendCodeBtn && sendCodeBtn.addEventListener('click', function () {
    if (sendCodeBtn.disabled) return;
    var phone = registerForm.phone.value.trim();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showMessage('请先输入正确手机号', 'error');
      return;
    }
    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = '已发送(60s)';
    count = 60;
    timer = setInterval(function () {
      count--;
      sendCodeBtn.textContent = '已发送(' + count + 's)';
      if (count <= 0) {
        clearInterval(timer);
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = '获取验证码';
      }
    }, 1000);
    showMessage('验证码已发送', 'success');
    // 这里可调用实际发送验证码API
  });
  // 消息提示
  function showMessage(message, type = 'info') {
    var existing = document.querySelector('.message-toast');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.className = 'message-toast ' + type;
    el.textContent = message;
    el.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);padding:12px 22px;border-radius:8px;color:#fff;font-weight:500;z-index:10000;max-width:90vw;word-break:break-all;box-shadow:0 2px 8px rgba(0,0,0,0.18);background:' +
      (type === 'success' ? 'linear-gradient(135deg,#4CAF50,#45a049)' : type === 'error' ? 'linear-gradient(135deg,#f44336,#da190b)' : 'linear-gradient(135deg,#2196F3,#0b7dda)') + ';';
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0.7'; }, 100);
    setTimeout(() => { el.style.opacity = '0'; el.style.top = '60px'; setTimeout(() => { el.remove(); }, 300); }, 2200);
  }
});