// 通用功能：移动端菜单展开收起，并在点击菜单项后自动收起
function setupMobileMenu(menuBtnId, navMenuId) {
  var menuBtn = document.getElementById(menuBtnId);
  var navMenu = document.getElementById(navMenuId);
  if (!menuBtn || !navMenu) return;
  menuBtn.addEventListener('click', function (e) {
    navMenu.classList.toggle('show');
    menuBtn.classList.toggle('active');
    e.stopPropagation(); // 阻止事件冒泡，防止点击按钮时触发document的点击
  });
  navMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('show');
      menuBtn.classList.remove('active');
    });
  });
  // 点击菜单外部收起菜单
  document.addEventListener('click', function (e) {
    if (navMenu.classList.contains('show')) {
      // 如果点击的不是菜单本身，也不是菜单按钮，也不是菜单内的元素
      if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        navMenu.classList.remove('show');
        menuBtn.classList.remove('active');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  setupMobileMenu('menuBtn', 'navMenu');
});
