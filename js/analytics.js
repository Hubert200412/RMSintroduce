// 数据分析和用户行为追踪
class Analytics {
  constructor() {
    this.events = [];
    this.userSession = this.generateSessionId();
    this.init();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  init() {
    // 页面加载时间统计
    this.trackPageLoad();
    
    // 用户交互追踪
    this.trackUserInteractions();
    
    // 页面停留时间
    this.trackPageDuration();
  }

  trackPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.track('page_load', {
        loadTime: loadTime,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });
  }

  trackUserInteractions() {
    // 跟踪按钮点击
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .btn-primary, .btn-submit, .btn-consult')) {
        this.track('button_click', {
          buttonText: e.target.textContent || e.target.value,
          buttonClass: e.target.className,
          elementId: e.target.id
        });
      }
    });

    // 跟踪表单提交
    document.addEventListener('submit', (e) => {
      this.track('form_submit', {
        formId: e.target.id || 'contact_form',
        url: window.location.href
      });
    });

    // 跟踪滚动深度
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) { // 每25%记录一次
          this.track('scroll_depth', { percent: maxScroll });
        }
      }
    });
  }

  trackPageDuration() {
    this.startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const duration = Date.now() - this.startTime;
      this.track('page_duration', { duration: duration });
    });
  }

  track(eventName, data = {}) {
    const event = {
      name: eventName,
      data: data,
      timestamp: Date.now(),
      sessionId: this.userSession,
      url: window.location.href
    };
    
    this.events.push(event);
    
    // 在开发环境下打印事件
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Analytics Event:', event);
    }
    
    // 这里可以发送到分析服务器
    this.sendToServer(event);
  }

  sendToServer(event) {
    // 模拟发送到分析服务器
    if (navigator.sendBeacon) {
      // 使用 sendBeacon API 发送数据
      navigator.sendBeacon('/api/analytics', JSON.stringify(event));
    } else {
      // 降级方案
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      }).catch(err => console.warn('Analytics send failed:', err));
    }
  }

  // 手动追踪自定义事件
  trackCustomEvent(eventName, data) {
    this.track(eventName, data);
  }
}

// 初始化分析工具
const analytics = new Analytics();

// 导出供其他模块使用
window.RMSAnalytics = analytics;
