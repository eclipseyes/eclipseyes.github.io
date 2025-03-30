document.addEventListener('DOMContentLoaded', function () {
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
  window.addEventListener('scroll', function () {
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
  document.addEventListener('visibilitychange', function () {
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
    // 检查之前保存的音乐状态
    const musicPlaying = localStorage.getItem('musicPlaying') === 'true';
    const musicPosition = parseFloat(localStorage.getItem('musicPosition') || '0');
    const pausedAt = parseInt(localStorage.getItem('musicPausedAt') || '0');
    const pauseDuration = pausedAt ? (Date.now() - pausedAt) / 1000 : 0;

    if (musicPlaying) {
      // 恢复播放状态
      bgMusic.currentTime = musicPosition;
      // 添加playing类以显示正确的按钮状态
      musicToggle.classList.add('playing');

      // 尝试播放（可能需要用户交互）
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log('自动播放失败，等待用户交互', e);
          // 自动播放失败时不要移除playing类，保持UI状态
        });
      }
    }

    // 添加点击事件
    musicToggle.addEventListener('click', function () {
      if (bgMusic.paused) {
        // 开始播放
        bgMusic.play()
          .then(() => {
            musicToggle.classList.add('playing');
            localStorage.setItem('musicPlaying', 'true');
          })
          .catch(e => {
            console.log('播放失败:', e);
          });
      } else {
        // 暂停播放
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        localStorage.setItem('musicPlaying', 'false');
      }
    });

    // 定期保存播放位置
    setInterval(() => {
      if (!bgMusic.paused) {
        localStorage.setItem('musicPosition', bgMusic.currentTime.toString());
      }
    }, 1000);
  }

  // 添加AJAX页面加载功能 - 保持背景视频连续播放
  setupAjaxNavigation();

  // 修复"了解更多"按钮的视频重影问题
  const learnMoreBtn = document.querySelector('.hero .btn');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', function (e) {
      e.preventDefault();

      // 停止当前视频，避免重影
      const currentVideo = document.querySelector('.video-background video');
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.style.display = 'none'; // 隐藏当前视频
      }

      // 短暂延迟后跳转
      setTimeout(() => {
        window.location.href = this.getAttribute('href');
      }, 300);
    });
  }

  // 调用音乐控制设置
  setupMusicControl();

  // 检查音乐按钮是否可见，如果不可见则显示
  const musicControl = document.querySelector('.music-control');
  if (musicControl) {
    musicControl.style.display = 'block';
    musicControl.style.opacity = '1';
  }

  // 初始化导航栏音乐控制
  setupNavMusicControl();

  // 添加到document ready函数中
  document.fonts.ready.then(function () {
    console.log('自定义字体已加载');
    // 可以在这里添加字体加载后的特殊处理
  });

  // 完全重写页面过渡动画功能
  setupPageTransition();
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

        link.addEventListener('click', function (e) {
          const href = this.getAttribute('href');

          // 不处理当前页面的链接
          if (window.location.pathname.endsWith(href)) return;

          e.preventDefault();

          // 先停止当前视频
          const currentVideo = document.querySelector('.video-background video');
          if (currentVideo) {
            currentVideo.pause();
            currentVideo.style.display = 'none'; // 隐藏当前视频避免重影
          }

          // 淡出内容
          const contentContainer = document.querySelector('.content-container');
          if (contentContainer) {
            contentContainer.classList.add('fade-out');
          }

          // 跳转到新页面
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        });
      }
    });
  }, 500); // 确保在DOM操作完成后添加事件监听器

  // 页面加载时添加淡入效果
  window.addEventListener('load', function () {
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

    menuToggle.addEventListener('click', function () {
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
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const href = this.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      // 停止当前视频避免重影
      const currentVideo = document.querySelector('.video-background video');
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.style.display = 'none';
      }

      // 保存音乐状态 - 关键修复部分
      const bgMusic = document.getElementById('bgMusic');
      if (bgMusic) {
        // 不暂停音乐，只保存状态
        localStorage.setItem('musicPlaying', (!bgMusic.paused).toString());
        localStorage.setItem('musicPosition', bgMusic.currentTime.toString());

        // 添加预缓冲时间，提高切换流畅度
        localStorage.setItem('musicPausedAt', Date.now().toString());
      }

      // 淡出内容
      const contentContainer = document.querySelector('.content-container');
      if (contentContainer) {
        contentContainer.classList.add('fade-out');
      }

      // 延长过渡时间，让页面淡出效果更明显，掩盖音乐短暂停顿
      setTimeout(() => {
        window.location.href = href;
      }, 400); // 增加到400ms
    });
  });

  // 处理浏览器的前进/后退按钮
  window.addEventListener('popstate', function (e) {
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

// 修改音乐控制功能，只使用导航栏按钮
function setupMusicControl() {
  // 不再需要初始化底部音乐控制按钮
  // 仅初始化导航栏音乐控制
  setupNavMusicControl();
}

// 修改导航栏音乐控制功能
function setupNavMusicControl() {
  const bgMusic = document.getElementById('bgMusic');
  const navMusicToggle = document.getElementById('navMusicToggle');

  if (bgMusic && navMusicToggle) {
    // 获取播放状态
    const musicPlaying = localStorage.getItem('musicPlaying') === 'true';
    const musicPosition = parseFloat(localStorage.getItem('musicPosition') || '0');

    // 更新UI状态
    if (musicPlaying) {
      navMusicToggle.classList.add('playing');

      // 尝试恢复音乐播放
      bgMusic.currentTime = musicPosition;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log('自动播放失败，等待用户交互');
        });
      }
    }

    // 添加点击事件
    navMusicToggle.onclick = function () {
      if (bgMusic.paused) {
        bgMusic.play()
          .then(() => {
            this.classList.add('playing');
            localStorage.setItem('musicPlaying', 'true');
            console.log('音乐开始播放');
          })
          .catch(e => {
            console.error('播放失败:', e);
          });
      } else {
        bgMusic.pause();
        this.classList.remove('playing');
        localStorage.setItem('musicPlaying', 'false');
        console.log('音乐已暂停');
      }
    };

    // 定期保存播放位置
    if (!window.musicPositionInterval) {
      window.musicPositionInterval = setInterval(() => {
        if (!bgMusic.paused) {
          localStorage.setItem('musicPosition', bgMusic.currentTime.toString());
        }
      }, 1000);
    }
  }
}

// 优化音乐控制系统，确保页面切换时音乐连续播放
function enhanceMusicControl() {
  const bgMusic = document.getElementById('bgMusic');
  const navMusicToggle = document.getElementById('navMusicToggle');

  if (bgMusic && navMusicToggle) {
    // 获取保存的音乐状态和播放位置
    const musicPlaying = localStorage.getItem('musicPlaying') === 'true';
    const musicPosition = parseFloat(localStorage.getItem('musicPosition') || '0');
    const musicVolume = parseFloat(localStorage.getItem('musicVolume') || '1');

    // 设置音量和播放位置
    bgMusic.volume = musicVolume;
    bgMusic.currentTime = musicPosition;

    // 更新UI状态
    if (musicPlaying) {
      navMusicToggle.classList.add('playing');

      // 特别处理: 在过渡动画结束后立即播放音乐以避免卡顿
      const playAfterTransition = () => {
        bgMusic.play().catch(e => {
          console.log('自动播放失败，等待用户交互');
        });
      };

      // 检查是否有过渡动画正在进行
      const transitionElement = document.querySelector('.page-transition');
      if (transitionElement && !transitionElement.classList.contains('transition-out')) {
        // 等待过渡结束后再播放
        setTimeout(playAfterTransition, 600);
      } else {
        // 立即尝试播放
        playAfterTransition();
      }
    }

    // 使用有记忆功能的音乐控制器
    navMusicToggle.onclick = function () {
      if (bgMusic.paused) {
        bgMusic.play()
          .then(() => {
            this.classList.add('playing');
            localStorage.setItem('musicPlaying', 'true');
          })
          .catch(e => {
            console.error('播放失败:', e);
          });
      } else {
        bgMusic.pause();
        this.classList.remove('playing');
        localStorage.setItem('musicPlaying', 'false');
        // 保存暂停时的位置
        localStorage.setItem('musicPosition', bgMusic.currentTime.toString());
      }
    };

    // 每秒保存播放位置，确保在页面切换时能够准确恢复
    const saveInterval = setInterval(() => {
      if (!bgMusic.paused) {
        localStorage.setItem('musicPosition', bgMusic.currentTime.toString());
      }
    }, 1000);

    // 页面关闭前保存最终状态
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('musicPosition', bgMusic.currentTime.toString());
      localStorage.setItem('musicVolume', bgMusic.volume.toString());
      clearInterval(saveInterval);
    });
  }
}

// 修改页面过渡功能，确保音乐播放不中断
function setupPageTransition() {
  // 创建纯黑色星空背景过渡层
  const transitionElement = document.createElement('div');
  transitionElement.className = 'page-transition';
  document.body.appendChild(transitionElement);

  // 页面加载完成后处理
  setTimeout(() => {
    // 淡出过渡层
    transitionElement.classList.add('transition-out');
    setTimeout(() => {
      transitionElement.style.display = 'none';

      // 过渡结束后确保音乐播放正常
      enhanceMusicControl();
    }, 600);
  }, 100);

  // 给所有导航链接添加点击事件
  document.querySelectorAll('nav a').forEach(link => {
    // 跳过当前页面的链接或外部链接
    if (link.classList.contains('active') ||
      link.getAttribute('href').startsWith('http') ||
      link.getAttribute('href').startsWith('#')) {
      return;
    }

    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');

      // 在跳转前保存音乐状态
      const bgMusic = document.getElementById('bgMusic');
      if (bgMusic) {
        localStorage.setItem('musicPosition', bgMusic.currentTime.toString());
        localStorage.setItem('musicVolume', bgMusic.volume.toString());
      }

      // 显示过渡遮罩
      transitionElement.style.display = 'block';
      transitionElement.classList.remove('transition-out');

      // 等待动画完成后再跳转
      setTimeout(() => {
        window.location.href = target;
      }, 400);
    });
  });
}

// 初始化调用
document.addEventListener('DOMContentLoaded', function () {
  setupPageTransition();
  // enhanceMusicControl 会由 setupPageTransition 调用
});