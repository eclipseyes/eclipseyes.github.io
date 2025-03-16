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
  
  // 页面切换动画 - 使用太空主题
  addPageTransitionAnimations();
});

// 添加页面切换动画
function addPageTransitionAnimations() {
  // 添加CSS
  const style = document.createElement('style');
  style.textContent = `
    .page-transition {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9999;
      background: var(--dark-bg);
      transform: scale(0);
      border-radius: 50%;
      transition: transform 0.8s cubic-bezier(0.86, 0, 0.07, 1);
    }
    
    .page-transition.active {
      transform: scale(3);
    }
    
    .space-particles {
      position: absolute;
      width: 2px;
      height: 2px;
      background: white;
      border-radius: 50%;
      animation: flyBy 0.8s linear forwards;
      opacity: 0;
    }
    
    @keyframes flyBy {
      0% {
        transform: translate(0, 0);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translate(var(--x), var(--y));
        opacity: 0;
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
    
    .shake {
      animation: shake 0.5s;
    }
    
    main {
      animation: scaleIn 0.5s ease-out forwards;
    }
    
    .section-animation {
      opacity: 0;
      animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .delay-1 {
      animation-delay: 0.2s;
    }
    
    .delay-2 {
      animation-delay: 0.4s;
    }
    
    .delay-3 {
      animation-delay: 0.6s;
    }
  `;
  
  document.head.appendChild(style);
  
  // 创建页面过渡元素
  const transitionEl = document.createElement('div');
  transitionEl.className = 'page-transition';
  document.body.appendChild(transitionEl);
  
  // 为每个页面链接添加过渡动画
  document.querySelectorAll('a').forEach(link => {
    // 只处理内部链接
    if (link.getAttribute('href') && 
        link.getAttribute('href').indexOf('#') !== 0 && 
        link.getAttribute('href').indexOf('http') !== 0) {
      
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // 不处理当前页面的链接
        if (window.location.pathname.endsWith(href)) return;
        
        e.preventDefault();
        
        // 计算点击位置
        const x = e.clientX;
        const y = e.clientY;
        
        // 设置过渡动画的起始位置
        transitionEl.style.top = y + 'px';
        transitionEl.style.left = x + 'px';
        transitionEl.classList.add('active');
        
        // 创建飞行粒子效果
        for (let i = 0; i < 30; i++) {
          createSpaceParticle(x, y);
        }
        
        // 延迟跳转以显示动画
        setTimeout(() => {
          window.location.href = href;
        }, 600);
      });
    }
  });
  
  // 添加页面加载动画
  window.addEventListener('load', function() {
    // 为主要内容添加动画
    document.querySelectorAll('section').forEach((section, index) => {
      section.classList.add('section-animation', `delay-${index % 3 + 1}`);
    });
    
    // 为特色元素添加旋转动画
    document.querySelectorAll('.planet, .moon').forEach(element => {
      element.style.animationPlayState = 'running';
    });
  });
}

// 创建太空粒子动画
function createSpaceParticle(x, y) {
  const particle = document.createElement('div');
  particle.className = 'space-particles';
  
  // 设置起始位置
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  
  // 随机设置粒子颜色
  const colors = ['#A8D8EA', '#FF9A8B', '#FCBAD3', '#FFFFB5'];
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];
  
  // 随机设置粒子大小
  const size = Math.random() * 3 + 1;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  
  // 随机设置飞行方向和距离
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 200 + 50;
  const destX = Math.cos(angle) * distance;
  const destY = Math.sin(angle) * distance;
  
  // 设置CSS变量用于动画
  particle.style.setProperty('--x', destX + 'px');
  particle.style.setProperty('--y', destY + 'px');
  
  // 添加到DOM
  document.body.appendChild(particle);
  
  // 动画结束后移除元素
  setTimeout(() => {
    particle.remove();
  }, 800);
} 