// 弹窗功能 for Mobile manual.html
// 依赖页面已有的 FontAwesome 和样式

document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.manual-section-card');
  const modal = document.createElement('div');
  modal.className = 'manual-modal';
  modal.innerHTML = `
    <div class="manual-modal-mask"></div>
    <div class="manual-modal-dialog">
      <button class="manual-modal-close" aria-label="关闭">&times;</button>
      <div class="manual-modal-content"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const mask = modal.querySelector('.manual-modal-mask');
  const closeBtn = modal.querySelector('.manual-modal-close');
  const contentBox = modal.querySelector('.manual-modal-content');

  // PC端内容映射
  const pcContent = {
    'manual-cash-register': `<h2><i class='fas fa-cash-register'></i> 智能收银系统</h2><ul><li>多支付方式集成：支持微信、支付宝、银行卡、现金等多种支付方式，满足不同客户需求。</li><li>自动生成报表：系统自动生成日报、周报、月报，实时掌握经营状况。</li><li>会员管理系统：积分、优惠券、等级管理，支持会员信息管理和消费记录查询。</li><li>优惠券管理：灵活设置满减、折扣、买赠等多种优惠方式。</li></ul>` ,
    'manual-supply-chain': `<h2><i class='fas fa-truck'></i> 供应链管理</h2><ul><li>智能采购建议：基于销售和库存数据智能推荐采购计划。</li><li>库存预警系统：实时监控库存状态，及时提醒补货。</li><li>供应商管理：统一管理供应商信息，建立评价体系。</li><li>成本分析报告：多维度分析食材成本，优化采购策略。</li></ul>` ,
    'manual-production': `<h2><i class='fas fa-utensils'></i> 生产管理</h2><ul><li>标准化菜谱管理：建立标准化菜谱库，确保菜品质量。</li><li>生产流程监控：实时监控厨房生产状态，优化出餐流程。</li><li>品质管控系统：完善品质管控体系，确保食品安全。</li><li>效率分析优化：数据分析优化生产流程，提升效率。</li></ul>` ,
    'manual-delivery': `<h2><i class='fas fa-motorcycle'></i> 外卖管理</h2><ul><li>多平台订单聚合：统一管理美团、饿了么等平台订单。</li><li>智能配送路径：智能规划配送路线，提升效率。</li><li>实时订单跟踪：实时跟踪订单状态，及时处理异常。</li><li>配送数据分析：详细分析配送效率和成本。</li></ul>` ,
    'manual-analytics': `<h2><i class='fas fa-chart-pie'></i> 数据分析</h2><ul><li>销售数据分析：统计分析销售额、商品销量、时段销售等。</li><li>客户行为分析：分析客户消费偏好、复购率等。</li><li>财务报表生成：自动生成各类财务报表。</li><li>趋势预测分析：基于历史数据预测未来趋势。</li></ul>` ,
    'manual-smart-devices': `<h2><i class='fas fa-microchip'></i> 智能设备</h2><ul><li>设备状态监控：实时监控设备运行状态。</li><li>故障预警系统：智能检测设备异常，提前预警。</li><li>远程诊断维护：支持远程诊断和维护。</li><li>设备使用分析：分析设备利用率、能耗等。</li></ul>`
  };

  function openModal(cardId) {
    contentBox.innerHTML = pcContent[cardId] || '<p>暂无详细内容</p>';
    modal.classList.add('show');
    document.body.classList.add('manual-modal-open');
  }
  function closeModal() {
    modal.classList.remove('show');
    document.body.classList.remove('manual-modal-open');
  }

  cards.forEach(card => {
    card.addEventListener('click', function () {
      openModal(card.id);
    });
  });
  closeBtn.addEventListener('click', closeModal);
  mask.addEventListener('click', closeModal);
});
