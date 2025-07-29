// products页面专有JS：点击卡片可跳转到详细说明或弹窗（可扩展）
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.products-section-card').forEach(function(card) {
    card.addEventListener('click', function() {
      alert('产品详情请联系顾问或查看PC端产品中心');
    });
  });
});
