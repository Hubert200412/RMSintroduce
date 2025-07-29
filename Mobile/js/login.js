// login页面专有JS：登录/注册切换、表单校验、验证码倒计时

document.addEventListener('DOMContentLoaded', function () {
  // tab切换
  var tabs = document.querySelectorAll('.tab-btn');
  var loginForm = document.getElementById('loginForm');
  var registerForm = document.getElementById('registerForm');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.tab === 'login') {
        loginForm.style.display = '';
        registerForm.style.display = 'none';
      } else {
        loginForm.style.display = 'none';
        registerForm.style.display = '';
      }
    });
  });

  // 登录表单校验
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var phone = loginForm.phone.value.trim();
    var pwd = loginForm.password.value.trim();
    if (!/^1[3-9]\d{9}$/.test(phone) || !pwd) {
      alert('请填写正确的手机号和密码');
      return;
    }
    alert('登录成功（模拟）');
    loginForm.reset();
  });

  // 注册表单校验
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var phone = registerForm.phone.value.trim();
    var pwd = registerForm.password.value.trim();
    var code = registerForm.code.value.trim();
    if (!/^1[3-9]\d{9}$/.test(phone) || !pwd || !code) {
      alert('请填写完整信息');
      return;
    }
    alert('注册成功（模拟）');
    registerForm.reset();
  });

  // 验证码倒计时
  var sendCodeBtn = document.getElementById('sendCodeBtn');
  var timer = null, count = 60;
  sendCodeBtn.addEventListener('click', function() {
    if (sendCodeBtn.disabled) return;
    var phone = registerForm.phone.value.trim();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      alert('请先输入正确手机号');
      return;
    }
    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = '已发送(60s)';
    count = 60;
    timer = setInterval(function() {
      count--;
      sendCodeBtn.textContent = '已发送(' + count + 's)';
      if (count <= 0) {
        clearInterval(timer);
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = '获取验证码';
      }
    }, 1000);
    // 这里可调用实际发送验证码API
  });
});
