// 新返回按钮 goBackAbout 方法
function goBackAbout() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'about.html'; // 没有历史时返回关于我们
  }
}
// 自动绑定新按钮
document.addEventListener('DOMContentLoaded', function () {
  var goBackBtn = document.getElementById('goBackBtn');
  if (goBackBtn) {
    goBackBtn.addEventListener('click', goBackAbout);
  }
});
// news-template.js
// 动态加载新闻详情
function getQueryParam(name) {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  return params.get(name);
}

const newsId = getQueryParam('id');
if (newsId !== null) {
  fetch('js/news-data.json')
    .then(response => response.json())
    .then(data => {
      const news = data.find(item => String(item.id) === String(newsId));
      if (!news) {
        document.getElementById('news-detail').innerHTML = '<p>未找到该新闻内容。</p>';
        return;
      }
      // 填充内容
      document.getElementById('news-title').textContent = news.title;
      document.getElementById('news-date').textContent = news.date + ' | ' + news.category;
      document.getElementById('news-image').src = news.image;
      document.getElementById('news-summary').textContent = news.summary;
      document.getElementById('news-content').textContent = news.content;
    })
    .catch(() => {
      document.getElementById('news-detail').innerHTML = '<p>新闻内容加载失败。</p>';
    });
} else {
  document.getElementById('news-detail').innerHTML = '<p>未指定新闻ID。</p>';
}
