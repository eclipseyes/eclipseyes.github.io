// 测试目录功能
document.addEventListener('DOMContentLoaded', function() {
  console.log('测试目录功能初始化');
  
  // 检查目录按钮是否存在
  setTimeout(() => {
    const tocBtn = document.querySelector('.toc-toggle-btn');
    if (tocBtn) {
      console.log('目录按钮已创建');
    } else {
      console.error('目录按钮未创建');
    }
    
    // 检查目录是否存在
    const toc = document.querySelector('.blog-toc');
    if (toc) {
      console.log('目录已创建');
      
      // 测试目录切换功能
      if (tocBtn) {
        console.log('测试目录切换功能');
        tocBtn.click();
        setTimeout(() => {
          const isHidden = toc.classList.contains('hidden');
          console.log('目录隐藏状态:', isHidden);
          
          // 恢复原状态
          tocBtn.click();
        }, 500);
      }
    } else {
      console.error('目录未创建');
    }
  }, 1000);
}); 