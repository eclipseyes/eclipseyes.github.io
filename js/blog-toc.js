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
    const headings = article.querySelectorAll('h1, h2, h3');
    if (headings.length < 2) return; // 如果标题太少，不需要目录

    // 创建目录容器 - 直接添加到body
    const tocContainer = document.createElement('div');
    tocContainer.className = 'blog-toc';
    tocContainer.innerHTML = '<h3>文章目录</h3>';

    // 创建目录列表
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    // 生成目录项
    headings.forEach((heading, index) => {
      // 为标题添加ID作为锚点
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      // 创建目录项
      const listItem = document.createElement('li');
      listItem.className = `toc-${heading.tagName.toLowerCase()}`;

      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.addEventListener('click', function (e) {
        e.preventDefault();

        // 滚动到对应标题位置
        const targetHeading = document.getElementById(heading.id);
        if (targetHeading) {
          window.scrollTo({
            top: targetHeading.offsetTop - 80,
            behavior: 'smooth'
          });
        }
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
  }

  // 更新当前激活的目录项
  function updateActiveHeading() {
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    const tocLinks = document.querySelectorAll('.toc-list a');
    const tocContainer = document.querySelector('.blog-toc');

    if (!headings.length || !tocLinks.length || !tocContainer) return;

    let currentActive = null;

    // 找出当前可见的标题
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const rect = heading.getBoundingClientRect();

      if (rect.top <= 100) {
        currentActive = heading.id;
      } else {
        break;
      }
    }

    // 移除所有激活状态
    tocLinks.forEach(link => link.classList.remove('active'));

    // 添加当前激活状态并处理滚动
    if (currentActive) {
      const activeLink = document.querySelector(`.toc-list a[href="#${currentActive}"]`);
      if (activeLink) {
        activeLink.classList.add('active');

        const activeLinkRect = activeLink.getBoundingClientRect();
        const tocContainerRect = tocContainer.getBoundingClientRect();

        // 计算当前项目相对于容器的位置
        const relativeTop = activeLinkRect.top - tocContainerRect.top;
        const containerCenter = tocContainerRect.height / 2;

        // 如果当前项目不在中心位置，进行滚动
        if (Math.abs(relativeTop - containerCenter) > 10) { // 添加一个小的容差值
          // 计算需要滚动到的位置，使当前项目精确居中
          const targetScrollTop = tocContainer.scrollTop + (relativeTop - containerCenter);

          // 使用快速平滑滚动
          smoothScrollWithEasing(tocContainer, tocContainer.scrollTop, targetScrollTop, 150);
        }
      }
    } else if (tocLinks.length) {
      tocLinks[0].classList.add('active');
    }
  }

  // 优化的平滑滚动函数
  function smoothScrollWithEasing(element, start, target, duration) {
    const startTime = performance.now();
    const distance = target - start;

    // 使用线性插值实现更直接的滚动效果
    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 应用缓动效果
      const eased = easeOutQuad(progress);
      element.scrollTop = start + (distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  // 博客文章渲染完成后生成目录
  function onBlogPostRendered() {
    if (window.location.hash.startsWith('#post/')) {
      setTimeout(generateTableOfContents, 500);
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
    setTimeout(onBlogPostRendered, 300);
  });

  // 初始化
  onBlogPostRendered();

  // 导出函数供其他模块使用
  window.BlogTOC = {
    generate: generateTableOfContents,
    update: updateActiveHeading
  };
}); 