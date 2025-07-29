// products页面专有JS：卡片展开/收起动画，参考卡片动效
document.addEventListener('DOMContentLoaded', function () {
  var cards = Array.from(document.querySelectorAll('.m-product-card'));
  cards.forEach(function(card) {
    var collapsed = card.querySelector('.m-product-card__collapsed');
    var expanded = card.querySelector('.m-product-card__expanded');
    // 点击卡片任意处展开
    collapsed.addEventListener('click', function(e) {
      if (e.target.classList.contains('m-product-card__buy-btn')) return;
      card.setAttribute('data-expanded', 'true');
      setTimeout(function() {
        card.scrollIntoView({behavior: 'smooth', block: 'center'});
      }, 200);
    });
    // 展开后点击图片或下方按钮收起
    expanded.addEventListener('click', function(e) {
      // 点击图片、文字区域都可收起
      if (
        e.target.classList.contains('m-product-card__img') ||
        e.target.classList.contains('m-product-card__buy-btn--expanded') ||
        e.target.closest('.m-product-card__desc') ||
        e.target.classList.contains('m-product-card__title')
      ) {
        card.setAttribute('data-expanded', 'false');
      }
    });
    // 展开后按钮点击（可扩展购买逻辑）
    var buyBtn = expanded.querySelector('.m-product-card__buy-btn--expanded');
    if (buyBtn) {
      buyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        alert('购买功能开发中，敬请期待！');
      });
    }
    // 折叠态按钮点击（可扩展购买逻辑）
    var buyBtnCollapsed = collapsed.querySelector('.m-product-card__buy-btn');
    if (buyBtnCollapsed) {
      buyBtnCollapsed.addEventListener('click', function(e) {
        e.stopPropagation();
        alert('购买功能开发中，敬请期待！');
      });
    }
  });
});
