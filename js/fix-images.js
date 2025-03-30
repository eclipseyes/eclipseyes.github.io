// 图片路径修复脚本
document.addEventListener('DOMContentLoaded', function() {
  // 初始页面加载时检查
  fixImagePaths();
  
  // 监听内容变化
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        fixImagePaths();
      }
    });
  });
  
  // 观察整个文档
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 修复图片路径的函数
  function fixImagePaths() {
    // 查找所有图片
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
      // 检查是否是相对路径
      const src = img.getAttribute('src');
      if (src && src.includes('../images/')) {
        // 替换路径 ../images/ -> /blog/images/
        img.src = src.replace('../images/', '/blog/images/');
        console.log('修复图片路径:', src, '->', img.src);
      }
    });
  }
}); 