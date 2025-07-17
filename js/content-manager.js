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
          title: "智能收银新体验",
          subtitle: "RMS餐饮系统，让经营更简单",
          image: "img/banner1.jpg",
          link: "#products",
          active: true
        },
        {
          id: 2,
          title: "数字化转型专家",
          subtitle: "全链路数字化解决方案",
          image: "img/banner2.jpg", 
          link: "#solutions",
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

    // 如果有多个banner，创建轮播
    if (this.contentConfig.banners.length > 1) {
      this.createBannerCarousel();
    }
  }

  createBannerCarousel() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // 创建轮播指示器
    const indicators = document.createElement('div');
    indicators.className = 'banner-indicators';
    
    this.contentConfig.banners.forEach((banner, index) => {
      const indicator = document.createElement('button');
      indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
      indicator.addEventListener('click', () => this.showBanner(index));
      indicators.appendChild(indicator);
    });

    hero.appendChild(indicators);

    // 自动轮播
    setInterval(() => {
      const activeIndex = this.getCurrentBannerIndex();
      const nextIndex = (activeIndex + 1) % this.contentConfig.banners.length;
      this.showBanner(nextIndex);
    }, 5000);
  }

  showBanner(index) {
    const banner = this.contentConfig.banners[index];
    if (!banner) return;

    const heroContent = document.querySelector('.hero-content');
    const titleElement = heroContent.querySelector('h1');
    const subtitleElement = heroContent.querySelector('.hero-subtitle');
    
    // 添加淡出效果
    heroContent.style.opacity = '0.5';
    
    setTimeout(() => {
      titleElement.textContent = banner.title;
      subtitleElement.textContent = banner.subtitle;
      heroContent.style.opacity = '1';
    }, 300);

    // 更新指示器
    document.querySelectorAll('.indicator').forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }

  getCurrentBannerIndex() {
    const activeIndicator = document.querySelector('.indicator.active');
    return activeIndicator ? Array.from(activeIndicator.parentNode.children).indexOf(activeIndicator) : 0;
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
