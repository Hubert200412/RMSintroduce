// about.js
// 动态加载新闻数据
fetch('js/news-data.json')
  .then(response => response.json())
  .then(data => {
    const newsList = document.getElementById('news-list');
    if (!newsList) return;
    // 按时间倒序排列
    data.sort((a, b) => b.date.localeCompare(a.date));
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.date} ${item.title}`;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        window.location.href = `news-template.html?id=${item.id}`;
      });
      newsList.appendChild(li);
    });
  })
  .catch(err => {
    const newsList = document.getElementById('news-list');
    if (newsList) {
      newsList.innerHTML = '<li>新闻动态加载失败</li>';
    }
  });
