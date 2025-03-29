/**
 * 博客文章目录生成和定位功能
 */
document.addEventListener('DOMContentLoaded', function () {
  // 生成并添加目录的函数
  function generateTableOfContents() {
    // 确保在文章页面才执行
    if (!window.location.hash.startsWith('#post/')) {
      // 如果不是文章页面，移除目录
      const oldToc = document.querySelector('.blog-toc');
      if (oldToc) oldToc.remove();
      return;
    }

    // 删除旧目录
    const oldToc = document.querySelector('.blog-toc');
    if (oldToc) oldToc.remove();

    const article = document.querySelector('.markdown-body');
    if (!article) return;

    // 查找所有标题元素
    const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length < 2) return; // 如果标题太少，不需要目录

    // 创建目录容器 - 直接添加到body
    const tocContainer = document.createElement('div');
    tocContainer.className = 'blog-toc';
    tocContainer.innerHTML = '<h3>文章目录</h3>';

    // 创建目录列表
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    // 为所有标题添加唯一ID
    headings.forEach((heading, index) => {
      // 确保每个标题都有唯一ID
      if (!heading.id || document.querySelectorAll(`#${heading.id}`).length > 1) {
        heading.id = `heading-${index}-${Date.now()}`;
      }
    });

    // 生成目录项
    headings.forEach((heading) => {
      // 创建目录项
      const listItem = document.createElement('li');
      listItem.className = `toc-${heading.tagName.toLowerCase()}`;

      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;

      // 修改点击事件处理
      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // 获取目标标题元素
        const targetHeading = document.getElementById(heading.id);
        if (!targetHeading) return;

        // 计算正确的滚动位置（考虑固定导航栏的高度）
        const headerOffset = 100; // 调整这个值以匹配您的导航栏高度
        const elementPosition = targetHeading.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // 使用平滑滚动
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // 更新激活状态
        document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');

        // 高亮目标标题
        targetHeading.classList.add('highlight');
        setTimeout(() => {
          targetHeading.classList.remove('highlight');
        }, 2000);
      });

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    tocContainer.appendChild(tocList);
    document.body.appendChild(tocContainer);

    // 小屏幕添加目录切换按钮
    if (window.innerWidth <= 1200) {
      const tocToggle = document.createElement('button');
      tocToggle.className = 'toc-toggle';
      tocToggle.innerHTML = '<i class="fas fa-list"></i>';
      tocToggle.addEventListener('click', function () {
        tocContainer.classList.toggle('visible');
      });
      document.body.appendChild(tocToggle);
    }

    updateActiveHeading();

    // 在目录生成完成后设置底部固定功能
    setupTocBottomFixing();
  }

  // 更新当前激活的目录项
  function updateActiveHeading() {
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6');
    if (headings.length === 0) return;

    // 获取所有目录链接
    const tocLinks = document.querySelectorAll('.toc-list a');
    if (tocLinks.length === 0) return;

    // 移除所有激活状态
    tocLinks.forEach(link => link.classList.remove('active'));

    // 找到当前视口中最靠近顶部的标题
    let currentActive = null;
    const headerOffset = 120; // 调整这个值以匹配您的导航栏高度

    // 从下往上检查，找到第一个在视口上方的标题
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      const rect = heading.getBoundingClientRect();

      if (rect.top <= headerOffset) {
        currentActive = heading.id;
        break;
      }
    }

    // 如果没有找到，使用第一个标题
    if (!currentActive && headings.length > 0) {
      currentActive = headings[0].id;
    }

    // 添加当前激活状态并处理滚动
    if (currentActive) {
      const activeLink = document.querySelector(`.toc-list a[href="#${currentActive}"]`);
      if (activeLink) {
        activeLink.classList.add('active');

        // 确保激活的目录项在视图中
        const tocContainer = document.querySelector('.blog-toc');
        if (tocContainer) {
          const activeLinkRect = activeLink.getBoundingClientRect();
          const tocContainerRect = tocContainer.getBoundingClientRect();

          // 计算当前项目相对于容器的位置
          const relativeTop = activeLinkRect.top - tocContainerRect.top;
          const containerCenter = tocContainerRect.height / 2;

          // 如果当前项目不在中心位置，进行滚动
          if (Math.abs(relativeTop - containerCenter) > 50) {
            // 计算需要滚动到的位置，使当前项目居中
            const targetScrollTop = tocContainer.scrollTop + (relativeTop - containerCenter);
            tocContainer.scrollTop = targetScrollTop;
          }
        }
      }
    }
  }

  // 添加目录底部固定功能
  function setupTocBottomFixing() {
    // 获取相关元素
    const tocElement = document.querySelector('.blog-toc');
    const articleElement = document.querySelector('.markdown-body');

    if (!tocElement || !articleElement) return;

    // 监听滚动事件
    window.addEventListener('scroll', _.throttle(function () {
      // 获取文章底部位置
      const articleBottom = articleElement.getBoundingClientRect().bottom;
      // 获取视口高度
      const viewportHeight = window.innerHeight;
      // 获取目录高度
      const tocHeight = tocElement.offsetHeight;
      // 目录底部应该在的位置（距离底部50px）
      const desiredTocBottom = viewportHeight - 50;

      // 如果文章底部进入视口，且小于期望的目录底部位置
      if (articleBottom < desiredTocBottom) {
        // 计算目录应该固定的位置
        const bottomFixedTop = articleBottom - tocHeight;

        // 添加底部固定类
        tocElement.classList.add('bottom-fixed');
        // 设置固定位置
        tocElement.style.top = `${bottomFixedTop}px`;
      } else {
        // 移除底部固定类，恢复正常定位
        tocElement.classList.remove('bottom-fixed');
        tocElement.style.top = '220px'; // 恢复默认顶部位置
      }
    }, 100));
  }

  // 博客文章渲染完成后生成目录
  function onBlogPostRendered() {
    if (window.location.hash.startsWith('#post/')) {
      setTimeout(() => {
        generateTableOfContents();
        setupTocBottomFixing(); // 确保设置了底部固定
      }, 800);
    }
  }

  // 监听滚动事件，更新激活的目录项
  window.addEventListener('scroll', _.throttle(updateActiveHeading, 100));

  // 监听URL变化
  window.addEventListener('hashchange', function () {
    // 如果不是文章页面，移除目录
    if (!window.location.hash.startsWith('#post/')) {
      const toc = document.querySelector('.blog-toc');
      if (toc) {
        toc.remove();
      }
    }
    setTimeout(onBlogPostRendered, 500);
  });

  // 初始化
  onBlogPostRendered();

  // 导出函数供其他模块使用
  window.BlogTOC = {
    generate: generateTableOfContents,
    update: updateActiveHeading
  };
}); 