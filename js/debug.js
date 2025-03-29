// 添加临时调试代码
document.addEventListener('DOMContentLoaded', function() {
  // 监听所有点击事件
  document.body.addEventListener('click', function(e) {
    // 检查是否点击了阅读更多按钮
    if (e.target.classList.contains('read-more-btn')) {
      console.log('点击了阅读更多按钮:', e.target.href);
    }
  });
  
  // 监听哈希变化
  window.addEventListener('hashchange', function() {
    console.log('URL哈希变化:', location.hash);
  });
}); 