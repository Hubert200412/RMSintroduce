// onlineshop页面专有JS：动态渲染分类和产品（示例数据，实际可接API）
document.addEventListener('DOMContentLoaded', function () {
  // 示例数据
  var products = [
    {name: '智能收银机', img: 'img/products1.jpg', price: '￥2999', desc: '高效收银，支持多种支付'},
    {name: '扫码点餐终端', img: 'img/products1.jpg', price: '￥1599', desc: '便捷扫码点餐'},
    {name: '厨房打印机', img: 'img/products1.jpg', price: '￥699', desc: '高效厨房出单'},
    {name: '会员管理系统', img: 'img/products1.jpg', price: '￥999', desc: '会员积分营销'},
    {name: '外卖聚合系统', img: 'img/products1.jpg', price: '￥1999', desc: '多平台外卖统一管理'},
    {name: '供应链管理', img: 'img/products1.jpg', price: '￥2999', desc: '智能采购库存'},
  ];
  var categories = ['全部', '收银设备', '点餐终端', '打印机', '管理系统'];

  // 渲染分类
  var categoryGrid = document.getElementById('categoryGrid');
  categoryGrid.innerHTML = categories.map(function(cat, i) {
    return '<button class="category-item'+(i===0?' active':'')+'" data-category="'+cat+'">'+cat+'</button>';
  }).join('');

  // 渲染产品
  function renderProducts(list) {
    var productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = list.map(function(p) {
      return '<div class="product-card">'
        +'<img src="'+p.img+'" alt="'+p.name+'">'
        +'<h3>'+p.name+'</h3>'
        +'<p>'+p.desc+'</p>'
        +'<div class="product-price">'+p.price+'</div>'
        +'<button class="product-buy-btn">购买</button>'
        +'</div>';
    }).join('');
  }
  renderProducts(products);

  // 分类点击筛选
  categoryGrid.addEventListener('click', function(e) {
    var btn = e.target.closest('.category-item');
    if (!btn) return;
    categoryGrid.querySelectorAll('.category-item').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    if (btn.dataset.category === '全部') {
      renderProducts(products);
    } else {
      renderProducts(products.filter(function(p){return p.name.indexOf(btn.dataset.category)!==-1;}));
    }
  });

  // 搜索功能
  document.getElementById('searchBtn').onclick = function () {
    var val = document.getElementById('searchInput').value.trim();
    if (!val) {renderProducts(products);return;}
    renderProducts(products.filter(function(p){return p.name.indexOf(val)!==-1||p.desc.indexOf(val)!==-1;}));
  };
});
