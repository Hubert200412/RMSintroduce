// inquiry页面专有JS：表单校验与提交（可根据后端API调整）
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('inquiryForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // 简单校验
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    if (!name || !/^1[3-9]\d{9}$/.test(phone)) {
      alert('请填写正确的姓名和手机号');
      return;
    }
    // 模拟提交
    alert('提交成功！我们会尽快与您联系。');
    form.reset();
  });
});
