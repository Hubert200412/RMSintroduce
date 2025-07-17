// 错误监控和性能追踪系统
class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.performance = {};
    this.init();
  }

  init() {
    this.setupErrorHandling();
    this.setupPerformanceMonitoring();
    this.setupResourceErrorTracking();
  }

  setupErrorHandling() {
    // 捕获JavaScript错误
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error ? event.error.stack : null,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // 捕获Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'promise',
        message: event.reason ? event.reason.toString() : 'Promise rejection',
        stack: event.reason ? event.reason.stack : null,
        timestamp: Date.now(),
        url: window.location.href
      });
    });

    // 重写console.error以捕获手动错误报告
    const originalError = console.error;
    console.error = (...args) => {
      this.logError({
        type: 'console',
        message: args.join(' '),
        timestamp: Date.now(),
        url: window.location.href
      });
      originalError.apply(console, args);
    };
  }

  setupResourceErrorTracking() {
    // 监听资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.logError({
          type: 'resource',
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          elementType: event.target.tagName,
          resourceUrl: event.target.src || event.target.href,
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    }, true);
  }

  setupPerformanceMonitoring() {
    // 页面加载性能监控
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = this.getPerformanceData();
        this.performance = perfData;
        
        // 如果性能较差，记录警告
        if (perfData.loadTime > 3000) {
          this.logError({
            type: 'performance',
            message: 'Slow page load detected',
            loadTime: perfData.loadTime,
            timestamp: Date.now(),
            url: window.location.href
          });
        }
      }, 1000);
    });

    // 监控长任务
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // 超过50ms的任务
            this.logError({
              type: 'longtask',
              message: 'Long task detected',
              duration: entry.duration,
              startTime: entry.startTime,
              timestamp: Date.now(),
              url: window.location.href
            });
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
    }
  }

  getPerformanceData() {
    if (!window.performance || !window.performance.timing) {
      return {};
    }

    const timing = window.performance.timing;
    const navigation = window.performance.navigation;

    return {
      // 页面加载时间
      loadTime: timing.loadEventEnd - timing.navigationStart,
      // DNS查询时间
      dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
      // TCP连接时间
      tcpTime: timing.connectEnd - timing.connectStart,
      // 请求响应时间
      requestTime: timing.responseEnd - timing.requestStart,
      // DOM解析时间
      domParseTime: timing.domContentLoadedEventEnd - timing.domLoading,
      // 资源加载时间
      resourceTime: timing.loadEventEnd - timing.domContentLoadedEventEnd,
      // 首次渲染时间
      firstPaint: this.getFirstPaint(),
      // 页面类型
      navigationType: navigation.type,
      // 重定向次数
      redirectCount: navigation.redirectCount
    };
  }

  getFirstPaint() {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const paintEntries = window.performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : null;
    }
    return null;
  }

  logError(errorData) {
    this.errors.push(errorData);
    
    // 在开发环境下打印错误
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.warn('Error logged:', errorData);
    }

    // 发送到错误监控服务
    this.sendErrorReport(errorData);

    // 如果错误过多，触发警告
    if (this.errors.length > 10) {
      console.warn('High error rate detected');
    }
  }

  sendErrorReport(errorData) {
    // 发送错误报告到服务器
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/errors', JSON.stringify(errorData));
    } else {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      }).catch(err => {
        // 避免错误报告本身产生错误
        console.warn('Error reporting failed:', err);
      });
    }
  }

  // 手动报告错误
  reportError(message, context = {}) {
    this.logError({
      type: 'manual',
      message: message,
      context: context,
      timestamp: Date.now(),
      url: window.location.href,
      stack: new Error().stack
    });
  }

  // 获取错误统计
  getErrorStats() {
    const errorTypes = {};
    this.errors.forEach(error => {
      errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
    });

    return {
      totalErrors: this.errors.length,
      errorTypes: errorTypes,
      performance: this.performance,
      recentErrors: this.errors.slice(-5) // 最近5个错误
    };
  }
}

// 网络状态监控
class NetworkMonitor {
  constructor() {
    this.connectionInfo = {};
    this.init();
  }

  init() {
    // 监控网络状态变化
    window.addEventListener('online', () => {
      console.log('Network: Online');
      this.updateConnectionStatus(true);
    });

    window.addEventListener('offline', () => {
      console.log('Network: Offline');
      this.updateConnectionStatus(false);
    });

    // 获取连接信息
    this.getConnectionInfo();

    // 定期检查网络速度
    this.startSpeedTest();
  }

  updateConnectionStatus(isOnline) {
    this.connectionInfo.isOnline = isOnline;
    this.connectionInfo.lastChange = Date.now();

    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('networkStatusChange', {
      detail: { isOnline, timestamp: this.connectionInfo.lastChange }
    }));
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      this.connectionInfo = {
        ...this.connectionInfo,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
  }

  async startSpeedTest() {
    // 简单的网络速度测试
    try {
      const startTime = Date.now();
      const response = await fetch('/favicon.ico?' + Math.random(), { cache: 'no-cache' });
      const endTime = Date.now();
      
      if (response.ok) {
        const speed = Math.round(1000 / (endTime - startTime));
        this.connectionInfo.speed = speed;
      }
    } catch (error) {
      console.warn('Speed test failed:', error);
    }
  }
}

// 初始化监控系统
const errorMonitor = new ErrorMonitor();
const networkMonitor = new NetworkMonitor();

// 导出供其他模块使用
window.RMSErrorMonitor = errorMonitor;
window.RMSNetworkMonitor = networkMonitor;

// 添加全局错误报告方法
window.reportError = (message, context) => {
  errorMonitor.reportError(message, context);
};
