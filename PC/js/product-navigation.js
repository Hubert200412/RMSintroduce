// 产品跳转功能
document.addEventListener('DOMContentLoaded', function () {
  // 为所有产品详情框添加点击事件
  const tooltipContainers = document.querySelectorAll('.tooltip-container');

  tooltipContainers.forEach(function (container) {
    // 添加鼠标样式
    container.style.cursor = 'pointer';

    // 添加点击事件
    container.addEventListener('click', function (e) {
      // 防止点击"咨询我们，了解详情"按钮时重复跳转
      if (e.target.classList.contains('product-more-info')) {
        return;
      }

      // 跳转到预约体验页面的表单位置
      window.open('inquiry.html#system-experience', '_blank');
    });

    // 添加悬停效果增强
    container.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.02)';
    });

    container.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
    });
  });
});

// 收银系统弹窗
document.querySelectorAll('.pos-popup-wrapper .popup-trigger').forEach(function (el) {
  el.addEventListener('click', function () {
    document.getElementById('pos-popup').style.display = 'flex';
  });
});
document.getElementById('pos-popup-close').onclick = function () {
  document.getElementById('pos-popup').style.display = 'none';
};
document.getElementById('pos-popup').onclick = function (e) {
  if (e.target === this) this.style.display = 'none';
};
// 收银配件弹窗
document.querySelectorAll('.acc-popup-wrapper .popup-trigger').forEach(function (el) {
  el.addEventListener('click', function () {
    document.getElementById('acc-popup').style.display = 'flex';
  });
});
document.getElementById('acc-popup-close').onclick = function () {
  document.getElementById('acc-popup').style.display = 'none';
};
document.getElementById('acc-popup').onclick = function (e) {
  if (e.target === this) this.style.display = 'none';
};