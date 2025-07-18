// 登录页面JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 表单切换动画
    const regLogCheckbox = document.getElementById('reg-log');
    const phoneLoginForm = document.getElementById('phoneLoginForm');
    const getCodeBtn = document.getElementById('getCodeBtn');
    const refreshQrBtn = document.getElementById('refreshQrBtn');
    const loginTabs = document.querySelectorAll('.login-tab');

    let countdown = 0;
    let countdownTimer = null;

    // 初始化标签页状态
    updateTabStates();

    // 登录标签页点击事件
    loginTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            if (tabType === 'phone') {
                // 切换到手机登录
                if (regLogCheckbox.checked) {
                    regLogCheckbox.checked = false;
                }
            } else if (tabType === 'qr') {
                // 切换到扫码登录
                if (!regLogCheckbox.checked) {
                    regLogCheckbox.checked = true;
                }
            }
            
            updateTabStates();
        });
    });

    // 监听checkbox变化
    if (regLogCheckbox) {
        regLogCheckbox.addEventListener('change', updateTabStates);
    }

    // 更新标签页状态
    function updateTabStates() {
        const isQrMode = regLogCheckbox ? regLogCheckbox.checked : false;
        
        loginTabs.forEach(tab => {
            const tabType = tab.getAttribute('data-tab');
            
            if ((tabType === 'phone' && !isQrMode) || (tabType === 'qr' && isQrMode)) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // 处理手机登录表单提交
    if (phoneLoginForm) {
        phoneLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = this.querySelector('.phone-input').value;
            const code = this.querySelector('.verification-input').value;
            const termsCheckbox = document.getElementById('termsCheckbox');
            
            // 检查协议条款勾选状态
            if (!termsCheckbox.checked) {
                showMessage('请先同意用户协议和隐私政策', 'error');
                termsCheckbox.focus();
                return;
            }
            
            // 基本验证
            if (!phone || !code) {
                showMessage('请填写完整的登录信息', 'error');
                return;
            }
            
            // 手机号格式验证
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                showMessage('请输入正确的手机号格式', 'error');
                return;
            }
            
            // 验证码格式验证
            if (code.length !== 6) {
                showMessage('请输入6位验证码', 'error');
                return;
            }
            
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
        getCodeBtn.addEventListener('click', function() {
            const phoneInput = document.querySelector('.phone-input');
            const phone = phoneInput.value;
            
            // 验证手机号
            if (!phone) {
                showMessage('请先输入手机号', 'error');
                phoneInput.focus();
                return;
            }
            
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                showMessage('请输入正确的手机号格式', 'error');
                phoneInput.focus();
                return;
            }
            
            // 开始倒计时
            startCountdown();
            
            // 模拟发送验证码
            showMessage('验证码已发送', 'success');
        });
    }

    // 刷新二维码功能
    if (refreshQrBtn) {
        refreshQrBtn.addEventListener('click', function() {
            showMessage('二维码已刷新', 'info');
            // 这里可以添加刷新二维码的逻辑
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
        phoneInput.addEventListener('input', function(e) {
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
        verificationInput.addEventListener('input', function(e) {
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
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // 背景形状动画
    createFloatingShapes();
    
    // 模拟二维码状态更新
    simulateQrCodeStatus();
});

// 模拟二维码状态
function simulateQrCodeStatus() {
    const qrContainer = document.querySelector('.qr-code-container');
    if (!qrContainer) return;
    
    // 模拟二维码加载
    setTimeout(() => {
        const placeholder = qrContainer.querySelector('.qr-code-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div style="width: 160px; height: 160px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 140px; height: 140px; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iYmxhY2siLz4KPC9zdmc+') center/contain no-repeat; border-radius: 4px;"></div>
                </div>
                <p style="margin-top: 10px; font-size: 12px;">扫描二维码登录</p>
            `;
        }
    }, 2000);
}

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
    switch(type) {
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
        shape.addEventListener('mouseenter', function() {
            this.style.opacity = '0.3';
            this.style.transform = 'scale(1.2)';
        });
        
        shape.addEventListener('mouseleave', function() {
            this.style.opacity = '0.1';
            this.style.transform = 'scale(1)';
        });
    });
}

// 添加窗口大小变化的响应
window.addEventListener('resize', function() {
    // 重新计算卡片位置
    const cardWrap = document.querySelector('.card-3d-wrap');
    if (cardWrap && window.innerWidth < 768) {
        cardWrap.style.width = Math.min(320, window.innerWidth - 40) + 'px';
    }
});

// 键盘导航支持
document.addEventListener('keydown', function(e) {
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
    
    // Tab键在表单切换时的处理
    if (e.key === 'Tab') {
        const regLogCheckbox = document.getElementById('reg-log');
        const activeForm = regLogCheckbox && regLogCheckbox.checked ? 
            document.getElementById('registerForm') : 
            document.getElementById('loginForm');
        
        if (activeForm) {
            const inputs = activeForm.querySelectorAll('input, button');
            const firstInput = inputs[0];
            const lastInput = inputs[inputs.length - 1];
            
            if (e.target === lastInput && !e.shiftKey) {
                e.preventDefault();
                firstInput.focus();
            } else if (e.target === firstInput && e.shiftKey) {
                e.preventDefault();
                lastInput.focus();
            }
        }
    }
});
