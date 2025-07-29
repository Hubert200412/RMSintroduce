// manual页面专有JS：点击卡片可跳转到详细说明或弹窗（可扩展）
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.manual-section-card').forEach(function(card) {
    card.addEventListener('click', function() {
      alert('功能详情请联系顾问或查看PC端手册');
    });
  });
});
