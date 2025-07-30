// products页面专有JS：卡片展开/收起动画，参考卡片动效
document.addEventListener('DOMContentLoaded', function () {
  fetch('js/products-data.json')
    .then(response => response.json())
    .then(data => {
      const products = data.products;
      const list = document.querySelector('.m-products-list');
      const searchInput = document.querySelector('.m-products-search');
      const filterBtns = Array.from(document.querySelectorAll('.m-products-filter-btn'));
      let currentCategory = 'all';
      let currentSearch = '';

      function render(filtered) {
        list.innerHTML = '';
        if (filtered.length === 0) {
          list.innerHTML = '<div style="text-align:center;color:#bbb;padding:2em 0;">未找到相关产品</div>';
          return;
        }
        filtered.forEach(product => {
          const section = document.createElement('section');
          section.className = 'm-product-card';
          section.setAttribute('data-expanded', 'false');
          section.innerHTML = `
            <div class="m-product-card__collapsed">
              <div class="m-product-card__img-wrap">
                <img src="${product.img}" alt="产品图片" class="m-product-card__img">
              </div>
              <div class="m-product-card__info">
                <div class="m-product-card__title">${product.name}</div>
                <button class="m-product-card__buy-btn">立即购买</button>
                <span class="m-product-card__price">点击展开，查看详情↓</span>
              </div>
            </div>
            <div class="m-product-card__expanded">
              <div class="m-product-card__img-wrap m-product-card__img-wrap--expanded">
                <img src="${product.img}" alt="产品图片" class="m-product-card__img">
              </div>
              <div class="m-product-card__details">
                <h3 class="m-product-card__title">${product.name}</h3>
                <div class="m-product-card__desc">
                  <ul class="m-product-card__params">
                    ${product.info.map(item => `<li>${item.label}：${item.value}</li>`).join('')}
                  </ul>
                  <span>点击收起↑</span>
                </div>
                <button class="m-product-card__buy-btn m-product-card__buy-btn--expanded">立即购买</button>
              </div>
            </div>
          `;
          list.appendChild(section);
        });
        // 绑定交互
        var cards = Array.from(document.querySelectorAll('.m-product-card'));
        cards.forEach(function(card) {
          var collapsed = card.querySelector('.m-product-card__collapsed');
          var expanded = card.querySelector('.m-product-card__expanded');
          collapsed.addEventListener('click', function(e) {
            if (e.target.classList.contains('m-product-card__buy-btn')) return;
            card.setAttribute('data-expanded', 'true');
            setTimeout(function() {
              card.scrollIntoView({behavior: 'smooth', block: 'center'});
            }, 200);
          });
          expanded.addEventListener('click', function(e) {
            if (
              e.target.classList.contains('m-product-card__img') ||
              e.target.classList.contains('m-product-card__buy-btn--expanded') ||
              e.target.closest('.m-product-card__desc') ||
              e.target.classList.contains('m-product-card__title')
            ) {
              card.setAttribute('data-expanded', 'false');
            }
          });
          var buyBtn = expanded.querySelector('.m-product-card__buy-btn--expanded');
          if (buyBtn) {
            buyBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              alert('购买功能开发中，敬请期待！');
            });
          }
          var buyBtnCollapsed = collapsed.querySelector('.m-product-card__buy-btn');
          if (buyBtnCollapsed) {
            buyBtnCollapsed.addEventListener('click', function(e) {
              e.stopPropagation();
              alert('购买功能开发中，敬请期待！');
            });
          }
        });
      }

      function filterProducts() {
        let filtered = products.filter(p => {
          // 分类
          if (currentCategory !== 'all' && p.category !== currentCategory) return false;
          // 搜索
          if (currentSearch) {
            const search = currentSearch.toLowerCase();
            // 检查所有字段
            let match = p.name.toLowerCase().includes(search) ||
              (p.info && p.info.some(item => (item.label + '：' + item.value).toLowerCase().includes(search)));
            return match;
          }
          return true;
        });
        render(filtered);
      }

      // 事件绑定
      filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCategory = btn.getAttribute('data-category');
          filterProducts();
        });
      });
      if (filterBtns.length) filterBtns[0].classList.add('active');

      if (searchInput) {
        searchInput.addEventListener('input', function() {
          currentSearch = searchInput.value.trim();
          filterProducts();
        });
      }

      // 首次渲染
      filterProducts();
    });
});
