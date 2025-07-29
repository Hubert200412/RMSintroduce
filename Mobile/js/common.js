// 通用功能：移动端菜单展开收起，并在点击菜单项后自动收起
function setupMobileMenu(menuBtnId, navMenuId) {
  var menuBtn = document.getElementById(menuBtnId);
  var navMenu = document.getElementById(navMenuId);
  if (!menuBtn || !navMenu) return;
  menuBtn.addEventListener('click', function () {
    navMenu.classList.toggle('show');
    menuBtn.classList.toggle('active');
  });
  navMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('show');
      menuBtn.classList.remove('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  setupMobileMenu('menuBtn', 'navMenu');
});
