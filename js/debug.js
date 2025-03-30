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

// 添加调试代码，帮助排查目录切换按钮问题
(function() {
  console.log('目录切换按钮调试模块已加载');
  
  // 在页面加载完成后检查目录和按钮状态
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      console.log('检查目录和按钮状态');
      
      const tocElement = document.querySelector('.blog-toc');
      const toggleBtn = document.querySelector('.toc-toggle-btn');
      
      console.log('目录元素存在:', !!tocElement);
      console.log('切换按钮存在:', !!toggleBtn);
      
      if (tocElement) {
        console.log('目录样式:', {
          display: window.getComputedStyle(tocElement).display,
          opacity: window.getComputedStyle(tocElement).opacity,
          transform: window.getComputedStyle(tocElement).transform,
          visibility: window.getComputedStyle(tocElement).visibility
        });
        console.log('目录类名:', tocElement.className);
      }
      
      if (toggleBtn) {
        console.log('按钮位置:', {
          top: toggleBtn.style.top,
          right: toggleBtn.style.right
        });
        console.log('按钮类名:', toggleBtn.className);
        
        // 添加测试点击事件
        console.log('添加测试点击事件');
        toggleBtn.addEventListener('click', function() {
          console.log('按钮被点击 (测试事件)');
        });
      }
      
      // 检查localStorage状态
      console.log('localStorage中的tocHidden值:', localStorage.getItem('tocHidden'));
    }, 2000);
  });
})(); 