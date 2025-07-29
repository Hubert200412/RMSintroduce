// 品牌logo横向无限滚动逻辑
document.addEventListener('DOMContentLoaded', function () {
  var scrollWrap = document.querySelector('.m-logo-scroll');
  if (!scrollWrap) return;

  // 1. 包裹内容track
  var content = scrollWrap.querySelectorAll('img');
  var track = document.createElement('div');
  track.className = 'm-logo-scroll-track';
  content.forEach(function(img) { track.appendChild(img.cloneNode(true)); });
  content.forEach(function(img) { track.appendChild(img.cloneNode(true)); }); // 两遍
  scrollWrap.innerHTML = '';
  scrollWrap.appendChild(track);

  // 2. 动画自适应宽度
  function setTrackWidth() {
    var imgs = track.querySelectorAll('img');
    var total = 0;
    imgs.forEach(function(img) { total += img.width || img.getBoundingClientRect().width; });
    track.style.width = (total) + 'px';
  }
  setTimeout(setTrackWidth, 300); // 等图片加载
  window.addEventListener('resize', setTrackWidth);
});
// 首页专有JS：横幅图片自动轮播
document.addEventListener('DOMContentLoaded', function () {
  var imgs = document.querySelectorAll('.m-hero-carousel .carousel-img');
  if (!imgs.length) return;
  var idx = 0;
  setInterval(function () {
    imgs[idx].classList.remove('active');
    idx = (idx + 1) % imgs.length;
    imgs[idx].classList.add('active');
  }, 3500);
});
