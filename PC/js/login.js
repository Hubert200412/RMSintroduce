// 登录页面JavaScript功能

document.addEventListener('DOMContentLoaded', function () {
    const phoneLoginForm = document.getElementById('phoneLoginForm');
    const getCodeBtn = document.getElementById('getCodeBtn');
    const refreshQrBtn = document.getElementById('refreshQrBtn');
    const loginTabs = document.querySelectorAll('.login-tab');

    let countdown = 0;
    let countdownTimer = null;

    // 初始化同意协议状态
    const termsCheckbox = document.getElementById('termsCheckbox');
    if (localStorage.getItem('termsAccepted') === 'true') {
        termsCheckbox.checked = true;
    }
    // 初始化记住我状态
    if (localStorage.getItem('rememberMe') === 'true') {
        document.getElementById('rememberMe').checked = localStorage.getItem('rememberMe');
        console.log('记住我状态' + document.getElementById('rememberMe').checked);
    }
    if (localStorage.getItem('rememberMe') === 'true') {
        console.log('商家号' + localStorage.getItem('merchantGroup'));
        document.getElementById('merchantInput').value = localStorage.getItem('merchantGroup') || '';
        console.log('密码' + localStorage.getItem('password'));
        document.getElementById('passwordInput').value = localStorage.getItem('password') || '';
        console.log('手机号' + localStorage.getItem('phone'));
         document.querySelector('.phone-input').value = localStorage.getItem('phone') || '';
    }

    // 监听 rememberMe checkbox 状态变化，未勾选时清除本地存储
    const rememberMeCheckbox = document.getElementById('rememberMe');
    if (rememberMeCheckbox) {
        rememberMeCheckbox.addEventListener('click', function () {
            if (!this.checked) {
                localStorage.removeItem('merchantGroup');
                localStorage.removeItem('phone');
                localStorage.removeItem('password');
                localStorage.setItem('rememberMe', 'false');
                console.log('记住我取消，清除本地存储');
            }
        });
    }

    // 处理手机登录表单提交
    if (phoneLoginForm) {
        phoneLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const merchant = this.querySelector('#merchantInput').value;
            const phone = this.querySelector('.phone-input').value;
            const code = this.querySelector('.verification-input').value;
            const password = this.querySelector('#passwordInput').value;
            const termsCheckbox = document.getElementById('termsCheckbox');

            // 检查协议条款勾选状态
            if (!termsCheckbox.checked) {
                showMessage('请先同意用户协议和隐私政策', 'error');
                termsCheckbox.focus();
                return;
            }

            // 基本验证
            if (!merchant) {
                showMessage('请填写商家号', 'error');
                this.querySelector('#merchantInput').focus();
                return;
            }
            if (!phone || !code) {
                showMessage('请填写完整的登录信息', 'error');
                return;
            }
            if (!password) {
                showMessage('请输入密码', 'error');
                this.querySelector('#passwordInput').focus();
                return;
            }

            // 验证码格式验证
            if (code.length !== 6) {
                showMessage('请输入6位验证码', 'error');
                return;
            }


            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('rememberMe', true);
                console.log('记住我已勾选');
                localStorage.setItem('merchantGroup', merchant);
                console.log('保存商家号到本地存储');
                localStorage.setItem('phone', phone);
                console.log('保存手机号到本地存储');
                localStorage.setItem('password', password);
                console.log('保存密码到本地存储');
            }

            // 保存协议勾选状态
            localStorage.setItem('termsAccepted', termsCheckbox.checked);


            // 模拟登录请求
            showMessage('正在登录...', 'info');

            setTimeout(() => {
                // 这里可以添加实际的登录逻辑
                showMessage('登录成功！正在跳转...', 'success');

                setTimeout(() => {
                    // 跳转到主页面或仪表板
                    window.location.href = 'index.html';
                }, 1500);
            }, 1000);
        });
    }

    // 获取验证码功能
    if (getCodeBtn) {
        getCodeBtn.addEventListener('click', function () {
            const phoneInput = document.querySelector('.phone-input');
            const phone = phoneInput.value;

            // 验证手机号
            if (!phone) {
                showMessage('请先输入手机号', 'error');
                phoneInput.focus();
                return;
            }

            // 开始倒计时
            startCountdown();

            // 模拟发送验证码
            showMessage('验证码已发送', 'success');
        });
    }

    // 倒计时功能
    function startCountdown() {
        countdown = 60;
        getCodeBtn.disabled = true;
        updateCountdownDisplay();

        countdownTimer = setInterval(() => {
            countdown--;
            updateCountdownDisplay();

            if (countdown <= 0) {
                clearInterval(countdownTimer);
                getCodeBtn.disabled = false;
                getCodeBtn.textContent = '获取验证码';
            }
        }, 1000);
    }

    function updateCountdownDisplay() {
        if (countdown > 0) {
            getCodeBtn.textContent = `${countdown}s后重新获取`;
        }
    }

    // 手机号输入限制
    const phoneInput = document.querySelector('.phone-input');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            // 只允许输入数字
            this.value = this.value.replace(/[^\d]/g, '');

            // 限制长度为11位
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });
    }

    // 验证码输入限制
    const verificationInput = document.querySelector('.verification-input');
    if (verificationInput) {
        verificationInput.addEventListener('input', function (e) {
            // 只允许输入数字
            this.value = this.value.replace(/[^\d]/g, '');

            // 限制长度为6位
            if (this.value.length > 6) {
                this.value = this.value.slice(0, 6);
            }
        });
    }

    // 添加输入框焦点效果
    const formInputs = document.querySelectorAll('.form-style, .country-select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // 背景形状动画
    createFloatingShapes();

});


// 显示消息提示
function showMessage(message, type = 'info') {
    // 移除已存在的消息
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }

    // 创建新的消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message-toast ${type}`;
    messageEl.textContent = message;

    // 添加样式
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    // 设置不同类型的背景色
    switch (type) {
        case 'success':
            messageEl.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            break;
        case 'error':
            messageEl.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
            break;
        case 'info':
            messageEl.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
            break;
        default:
            messageEl.style.background = 'linear-gradient(135deg, #ff6b35, #f9ca24)';
    }

    document.body.appendChild(messageEl);

    // 显示动画
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// 创建浮动形状动画
function createFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        // 随机设置动画延迟
        const delay = Math.random() * 4;
        shape.style.animationDelay = delay + 's';

        // 添加鼠标悬停效果
        shape.addEventListener('mouseenter', function () {
            this.style.opacity = '0.3';
            this.style.transform = 'scale(1.2)';
        });

        shape.addEventListener('mouseleave', function () {
            this.style.opacity = '0.1';
            this.style.transform = 'scale(1)';
        });
    });
}

// 添加窗口大小变化的响应
window.addEventListener('resize', function () {
    // 重新计算卡片位置
    const cardWrap = document.querySelector('.card-3d-wrap');
    if (cardWrap && window.innerWidth < 768) {
        cardWrap.style.width = Math.min(320, window.innerWidth - 40) + 'px';
    }
});

// 键盘导航支持
document.addEventListener('keydown', function (e) {
    // ESC键关闭消息提示
    if (e.key === 'Escape') {
        const messageToast = document.querySelector('.message-toast');
        if (messageToast) {
            messageToast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageToast.parentNode) {
                    messageToast.parentNode.removeChild(messageToast);
                }
            }, 300);
        }
    }
});
