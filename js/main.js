// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 导航栏滚动效果
  const header = document.querySelector('header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // 添加动画效果
  const animateElements = document.querySelectorAll('.feature-box, .project-card');
  
  // 检查元素是否在视口中
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
  
  // 滚动时检查元素是否应该显示动画
  function checkAnimation() {
    animateElements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('animated');
      }
    });
  }
  
  // 初始检查
  checkAnimation();
  
  // 滚动时检查
  window.addEventListener('scroll', checkAnimation);
}); 