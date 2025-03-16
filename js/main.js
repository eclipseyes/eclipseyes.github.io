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
  
  // 视频相关设置
  const video = document.getElementById('bgVideo');
  
  // 确保视频静音
  video.muted = true;
  
  // 视频性能优化：如果页面不在视图中，暂停视频以节省资源
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      video.pause();
    } else {
      video.play().catch(e => {
        console.log('自动播放被阻止，这在某些浏览器中是正常的');
      });
    }
  });
  
  // 添加移动端菜单功能
  setupMobileMenu();
  
  // 背景音乐控制 - 仅保留右下角按钮
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  
  if (bgMusic && musicToggle) {
    // 强制预加载音频
    bgMusic.load();
    
    // 添加加载状态指示
    let isLoading = false;
    let isPlaying = false; // 跟踪实际播放状态
    
    // 监听音频结束事件，确保循环播放
    bgMusic.addEventListener('ended', function() {
      console.log('音频播放结束，准备重新播放');
      // 即使设置了loop属性，也手动重新开始播放以确保可靠性
      if (isPlaying) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(error => {
          console.log('重新播放失败:', error);
        });
      }
    });
    
    musicToggle.addEventListener('click', function() {
      if (isLoading) return; // 防止重复点击
      
      if (!isPlaying) {
        // 显示加载状态
        isLoading = true;
        musicToggle.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // 尝试播放
        bgMusic.currentTime = 0; // 从头开始播放
        bgMusic.play()
          .then(() => {
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            musicToggle.classList.add('playing');
            isLoading = false;
            isPlaying = true;
          })
          .catch(error => {
            console.log('播放失败:', error);
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            isLoading = false;
          });
      } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        isPlaying = false;
      }
    });
    
    // 监听音频加载状态
    bgMusic.addEventListener('canplaythrough', function() {
      console.log('音频已完全加载，可以播放');
    });
    
    // 确保页面可见性变化时音乐播放状态正确
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden && isPlaying && bgMusic.paused) {
        bgMusic.play().catch(e => console.log('自动恢复播放失败'));
      }
    });
  }
  
  // 添加AJAX页面加载功能 - 保持背景视频连续播放
  setupAjaxNavigation();
});

// 添加页面切换动画 - 仅淡化内容，保留背景
function addPageTransitionAnimations() {
  // 添加CSS
  const style = document.createElement('style');
  style.textContent = `
    /* 内容淡入淡出效果 */
    .content-fade {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    
    .content-fade.fade-out {
      opacity: 0;
    }
    
    /* 页面加载时的淡入效果 */
    .main-content {
      opacity: 0;
      animation: fadeIn 0.6s ease-out 0.1s forwards;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
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
  
  // 将主要内容包装在一个div中
  const wrapContent = () => {
    // 这些元素不需要包装，因为它们是背景
    const skipElements = [
      '.video-background',
      '.moon',
      '.comet',
      '.star',
      '#bgMusic',
      '.music-control'
    ];
    
    // 创建内容包装器
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'main-content content-fade';
    
    // 获取body的所有直接子元素
    const bodyChildren = Array.from(document.body.children);
    
    // 过滤出需要包装的元素
    const elementsToWrap = bodyChildren.filter(el => {
      // 跳过脚本标签和背景元素
      if (el.tagName === 'SCRIPT' || el === contentWrapper) return false;
      
      // 检查是否是需要跳过的背景元素
      for (const selector of skipElements) {
        if (el.matches(selector) || el.querySelector(selector)) return false;
      }
      
      return true;
    });
    
    // 将需要包装的元素移入包装器
    elementsToWrap.forEach(el => {
      contentWrapper.appendChild(el);
    });
    
    // 将包装器添加到body
    document.body.appendChild(contentWrapper);
  };
  
  // 在DOM加载完成后执行包装
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wrapContent);
  } else {
    wrapContent();
  }
  
  // 为内部链接添加淡出效果
  setTimeout(() => {
    document.querySelectorAll('nav a').forEach(link => {
      // 只处理内部链接
      if (link.getAttribute('href') && 
          link.getAttribute('href').indexOf('#') !== 0 && 
          link.getAttribute('href').indexOf('http') !== 0) {
        
        link.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          
          // 不处理当前页面的链接
          if (window.location.pathname.endsWith(href)) return;
          
          e.preventDefault();
          
          // 只淡出内容部分
          const contentWrapper = document.querySelector('.main-content');
          if (contentWrapper) {
            contentWrapper.classList.add('fade-out');
          }
          
          // 短暂延迟后跳转到新页面
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        });
      }
    });
  }, 500); // 确保在DOM操作完成后添加事件监听器
  
  // 页面加载时添加淡入效果
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

// 添加移动端菜单切换功能
function setupMobileMenu() {
  const nav = document.querySelector('nav');
  
  // 如果尚未创建移动菜单按钮，则创建一个
  if (!document.querySelector('.mobile-menu-toggle')) {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-star"></i>';
    
    // 插入到导航之前
    nav.parentNode.insertBefore(menuToggle, nav);
    
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }
}

// 修复背景视频持续播放问题
function setupAjaxNavigation() {
  console.log("初始化AJAX导航");
  
  // 保存原始背景视频引用
  const originalVideo = document.querySelector('.video-background video');
  let currentVideoTime = 0;
  if (originalVideo) {
    currentVideoTime = originalVideo.currentTime;
    console.log("获取当前视频时间:", currentVideoTime);
  }

  const bgMusic = document.getElementById('bgMusic');
  let isMusicPlaying = bgMusic && !bgMusic.paused;
  
  // 添加必要的CSS
  const style = document.createElement('style');
  style.textContent = `
    /* 内容淡入淡出效果 */
    .content-container {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    
    .content-container.fade-out {
      opacity: 0;
    }
    
    /* 背景元素容器 */
    .background-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    
    /* 加载指示器 */
    .page-loader {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      display: none;
    }
    
    .page-loader.active {
      display: block;
    }
    
    .loader-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(163, 191, 250, 0.3);
      border-radius: 50%;
      border-top-color: var(--accent);
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // 创建背景容器和内容容器
  const setupContainers = () => {
    // 创建背景容器
    let backgroundContainer = document.querySelector('.background-container');
    if (!backgroundContainer) {
      backgroundContainer = document.createElement('div');
      backgroundContainer.className = 'background-container';
      document.body.appendChild(backgroundContainer);
    }
    
    // 创建内容容器
    let contentContainer = document.querySelector('.content-container');
    if (!contentContainer) {
      contentContainer = document.createElement('div');
      contentContainer.className = 'content-container';
      document.body.appendChild(contentContainer);
    }
    
    // 将背景元素移到背景容器中
    const backgroundElements = [
      '.video-background',
      '.moon',
      '.comet',
      '.star',
      '#bgMusic',
      '.music-control'
    ];
    
    backgroundElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && !backgroundContainer.contains(el)) {
          console.log(`移动背景元素到背景容器: ${selector}`);
          backgroundContainer.appendChild(el);
        }
      });
    });
    
    // 将所有其他元素(不包括脚本和已处理元素)移到内容容器中
    Array.from(document.body.children).forEach(el => {
      if (el !== backgroundContainer && 
          el !== contentContainer && 
          el.tagName !== 'SCRIPT' && 
          !el.matches('.background-container, .content-container, .page-loader')) {
        console.log(`移动内容元素到内容容器: ${el.tagName}`);
        contentContainer.appendChild(el);
      }
    });
    
    return { backgroundContainer, contentContainer };
  };
  
  const { backgroundContainer, contentContainer } = setupContainers();
  
  // 创建加载指示器
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '<div class="loader-spinner"></div>';
  document.body.appendChild(loader);
  
  // 为所有导航链接添加AJAX加载
  document.addEventListener('click', function(e) {
    // 查找最近的a标签
    let target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentNode;
      if (!target || target === document.body) return;
    }
    
    // 如果找到a标签并且是内部链接
    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href');
      
      // 排除外部链接、锚点链接和当前页面
      if (!href || 
          href.startsWith('#') || 
          href.startsWith('http') || 
          href.startsWith('mailto:') ||
          window.location.pathname.endsWith(href)) {
        return;
      }
      
      e.preventDefault();
      console.log(`拦截链接点击: ${href}`);
      
      // 保存当前视频播放时间和音乐状态
      const video = document.querySelector('.video-background video');
      if (video) {
        currentVideoTime = video.currentTime;
        console.log(`保存视频当前时间: ${currentVideoTime}`);
      }
      
      // 保存音乐播放状态
      const music = document.getElementById('bgMusic');
      isMusicPlaying = music && !music.paused;
      
      // 淡出当前内容
      contentContainer.classList.add('fade-out');
      
      // 显示加载指示器
      loader.classList.add('active');
      
      // 延迟加载新内容
      setTimeout(() => {
        // 加载新页面内容
        fetch(href)
          .then(response => response.text())
          .then(html => {
            console.log(`已加载页面: ${href}`);
            
            // 解析HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 提取标题
            document.title = doc.title;
            
            // 提取内容区域
            const newContent = doc.querySelector('.content-container') || doc.body;
            
            // 替换内容
            contentContainer.innerHTML = newContent.innerHTML;
            
            // 淡入新内容
            contentContainer.classList.remove('fade-out');
            
            // 更新浏览器历史
            window.history.pushState({path: href}, '', href);
            
            // 恢复视频播放位置
            const videoEl = document.querySelector('.video-background video');
            if (videoEl) {
              console.log(`恢复视频播放位置: ${currentVideoTime}`);
              videoEl.currentTime = currentVideoTime;
            }
            
            // 恢复音乐播放状态
            const musicEl = document.getElementById('bgMusic');
            if (musicEl && isMusicPlaying && musicEl.paused) {
              console.log('恢复音乐播放');
              musicEl.play().catch(e => console.log('无法恢复音乐播放'));
            }
            
            // 更新当前活动导航项
            updateActiveNavItem();
            
            // 隐藏加载指示器
            loader.classList.remove('active');
            
            // 重新初始化脚本
            reinitializeScripts();
          })
          .catch(err => {
            console.error('加载页面失败:', err);
            // 发生错误时直接导航
            window.location.href = href;
          });
      }, 300);
    }
  });
  
  // 处理浏览器的前进/后退按钮
  window.addEventListener('popstate', function(e) {
    console.log('检测到浏览器历史导航');
    
    // 保存当前视频播放时间
    const video = document.querySelector('.video-background video');
    if (video) {
      currentVideoTime = video.currentTime;
      console.log(`保存视频当前时间: ${currentVideoTime}`);
    }
    
    // 加载当前URL对应的页面内容
    fetch(window.location.pathname)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        document.title = doc.title;
        
        const newContent = doc.querySelector('.content-container') || doc.body;
        contentContainer.innerHTML = newContent.innerHTML;
        
        // 恢复视频播放位置
        const videoEl = document.querySelector('.video-background video');
        if (videoEl) {
          console.log(`恢复视频播放位置: ${currentVideoTime}`);
          videoEl.currentTime = currentVideoTime;
        }
        
        updateActiveNavItem();
        reinitializeScripts();
      })
      .catch(err => {
        console.error('加载页面失败:', err);
        window.location.reload();
      });
  });
  
  // 更新当前活动导航项
  function updateActiveNavItem() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (window.location.pathname.endsWith(href)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // 重新初始化页面脚本
  function reinitializeScripts() {
    console.log('重新初始化页面脚本');
    
    // 为新加载的内容添加动画
    document.querySelectorAll('section').forEach((section, index) => {
      section.classList.add('section-animation', `delay-${index % 3 + 1}`);
    });
    
    // 重新绑定事件处理器
    setupMobileMenu();
    
    // 重新绑定语言切换功能
    if (typeof initLanguageSelector === 'function') {
      initLanguageSelector();
    }
    
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
  }
  
  // 初始化
  updateActiveNavItem();
  console.log("AJAX导航设置完成");
} 