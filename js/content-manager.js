// 动态内容管理系统
class ContentManager {
  constructor() {
    this.contentConfig = {
      banners: [],
      products: [],
      news: [],
      cases: []
    };
    this.init();
  }

  async init() {
    try {
      // 模拟从API获取配置数据
      await this.loadContentConfig();
      this.renderDynamicContent();
    } catch (error) {
      console.error('Content loading failed:', error);
      this.loadDefaultContent();
    }
  }

  async loadContentConfig() {
    // 模拟API调用，实际应该从后台获取
    const mockData = {
      banners: [
        {
          id: 1,
          title: "RMS餐饮管理系统",
          subtitle: "专业的餐厅数字化管理解决方案，助力餐饮企业实现智能化运营",
          image: "img/banner1.jpg",
          link: "#products",
          active: true
        }
      ],
      products: [
        {
          id: 1,
          name: "智能收银系统",
          description: "支持多种支付方式，快速结账",
          features: ["多支付方式", "自动对账", "会员管理"],
          icon: "fas fa-cash-register",
          highlighted: true
        }
      ],
      news: [
        {
          id: 1,
          title: "RMS系统助力餐厅数字化升级",
          summary: "新功能上线，帮助餐厅提升效率",
          image: "img/news1.jpg",
          date: "2024-01-15",
          link: "#"
        }
      ]
    };

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    this.contentConfig = mockData;
  }

  loadDefaultContent() {
    // 加载默认内容，避免API失败时页面空白
    console.log('Loading default content...');
  }

  renderDynamicContent() {
    this.renderBanners();
    this.renderNews();
    this.updateProductHighlights();
  }

  renderBanners() {
    const heroSection = document.querySelector('.hero-content');
    if (!heroSection || !this.contentConfig.banners.length) return;

    const activeBanner = this.contentConfig.banners.find(b => b.active) || this.contentConfig.banners[0];
    
    const titleElement = heroSection.querySelector('h1');
    const subtitleElement = heroSection.querySelector('.hero-subtitle');
    
    if (titleElement) titleElement.textContent = activeBanner.title;
    if (subtitleElement) subtitleElement.textContent = activeBanner.subtitle;
  }

  renderNews() {
    if (!this.contentConfig.news.length) return;

    // 如果页面有新闻区域，动态插入新闻内容
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer) {
      this.createNewsSection();
    }
  }

  createNewsSection() {
    const casesSection = document.querySelector('#cases');
    if (!casesSection) return;

    const newsSection = document.createElement('section');
    newsSection.id = 'news';
    newsSection.className = 'news';
    newsSection.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2>最新动态</h2>
          <p>了解RMS系统最新功能和行业资讯</p>
        </div>
        <div class="news-grid">
          ${this.contentConfig.news.map(news => `
            <div class="news-card">
              <div class="news-image">
                <img src="${news.image}" alt="${news.title}">
              </div>
              <div class="news-content">
                <h3>${news.title}</h3>
                <p>${news.summary}</p>
                <div class="news-meta">
                  <span class="news-date">${news.date}</span>
                  <a href="${news.link}" class="news-link">查看详情</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    casesSection.insertAdjacentElement('afterend', newsSection);
  }

  updateProductHighlights() {
    // 根据配置高亮显示特定产品
    const highlightedProducts = this.contentConfig.products.filter(p => p.highlighted);
    
    highlightedProducts.forEach(product => {
      const productElement = document.querySelector(`[data-product-id="${product.id}"]`);
      if (productElement) {
        productElement.classList.add('highlighted');
      }
    });
  }

  // 添加实时更新内容的方法
  async refreshContent() {
    await this.loadContentConfig();
    this.renderDynamicContent();
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('contentUpdated', {
      detail: this.contentConfig
    }));
  }
}

// 初始化内容管理器
const contentManager = new ContentManager();

// 导出供其他模块使用
window.RMSContentManager = contentManager;
