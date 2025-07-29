// 动态加载弹窗内容
fetch('js/products-data.json')
  .then(res => res.json())
  .then(data => {
    // 渲染收银系统
    const pos = data.products.find(p => p.id === 'pos');
    if (pos) {
      const ul = document.getElementById('pos-info-list');
      ul.innerHTML = pos.info.map(item => `<li><strong>${item.label}：</strong>${item.value}</li>`).join('');
    }
    // 渲染收银配件
    const acc = data.products.find(p => p.id === 'acc');
    if (acc) {
      const ul = document.getElementById('acc-info-list');
      ul.innerHTML = acc.info.map(item => `<li><strong>${item.label}：</strong>${item.value}</li>`).join('');
    }
  });
