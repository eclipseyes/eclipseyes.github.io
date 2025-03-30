window.addEventListener('hashchange', function () {
  if (location.hash === '' || location.hash === '#') {
    switchToList();
  } else if (location.hash.startsWith('#post/')) {
    switchToPost();
  }
});

// 页面加载时也需要检查hash并加载相应内容
document.addEventListener('DOMContentLoaded', function () {
  // 如果URL中包含文章ID，则加载文章
  if (location.hash.startsWith('#post/')) {
    loadBlogPost();
    
    // 确保目录和按钮正确加载
    setTimeout(function() {
      // 检查目录是否存在
      const tocElement = document.querySelector('.blog-toc');
      if (!tocElement) {
        console.log('目录不存在，尝试生成');
        if (typeof window.BlogTOC !== 'undefined' && typeof window.BlogTOC.generate === 'function') {
          window.BlogTOC.generate();
        }
      }
      
      // 检查按钮是否存在
      const tocBtn = document.querySelector('.toc-toggle-btn');
      if (!tocBtn && tocElement) {
        console.log('目录存在但按钮不存在，添加按钮');
        if (typeof window.BlogTOC !== 'undefined' && typeof window.BlogTOC.addTocToggleButton === 'function') {
          window.BlogTOC.addTocToggleButton();
        }
      }
    }, 1500);
  } else {
    // 否则加载博客列表
    loadBlogList();
  }
});

// 加载博客列表
function loadBlogList() {
  fetch('/blog/index.json')
    .then(response => response.json())
    .then(posts => {
      const blogList = document.getElementById('blogList');
      if (!blogList) return;

      // 清空原有内容
      blogList.innerHTML = '';

      // 对文章按日期排序（从新到旧）
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      // 创建文章列表
      posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-preview';

        // 拼接HTML内容
        article.innerHTML = `
          <div class="blog-card">
            ${post.coverImage ? `<img src="/${post.coverImage}" alt="${post.title}" class="blog-cover">` : ''}
            <div class="blog-content">
              <h2><a href="#post/${post.id}">${post.title}</a></h2>
              <div class="blog-meta">
                <span class="blog-date">${post.date}</span>
                ${post.tags && post.tags.length ? `
                  <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
              <p class="blog-summary">${post.summary}</p>
              <a href="#post/${post.id}" class="read-more">阅读更多</a>
            </div>
          </div>
        `;

        blogList.appendChild(article);
      });

      document.getElementById('blogList').style.display = 'block';
      document.getElementById('blogPost').style.display = 'none';
    })
    .catch(error => {
      console.error('加载博客列表失败:', error);
    });
}

// 加载博客文章
function loadBlogPost() {
  // 从URL中获取文章ID
  const postId = location.hash.replace('#post/', '');

  // 加载文章内容
  fetch(`/blog/posts/${postId}.md`)
    .then(response => {
      if (!response.ok) {
        throw new Error('文章不存在');
      }
      return response.text();
    })
    .then(markdown => {
      // 转换Markdown为HTML (简单版本，您可能需要使用更完善的Markdown解析器)
      const html = convertMarkdownToHtml(markdown);

      // 显示文章内容
      const blogPost = document.getElementById('blogPost');
      if (!blogPost) return;

      blogPost.innerHTML = html;

      // 同时加载文章元数据以显示标题、日期等
      fetch('/blog/index.json')
        .then(response => response.json())
        .then(posts => {
          const post = posts.find(p => p.id === postId);
          if (post) {
            // 如果需要，可以在这里添加标题、日期等元素
            document.title = `${post.title} - 博客`;

            // 如果页面上有元数据容器，可以填充
            const metaContainer = document.querySelector('.blog-meta-header');
            if (metaContainer) {
              metaContainer.innerHTML = `
                <h1>${post.title}</h1>
                <div class="meta">
                  <span class="date">${post.date}</span>
                  ${post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
              `;
            }
          }
        });

      // 在显示文章内容前，确保列表已隐藏
      document.getElementById('blogList').style.display = 'none';
      document.getElementById('blogPost').style.display = 'block';

      // 触发一次重排以刷新视图
      document.body.offsetHeight;

      // 滚动到顶部
      window.scrollTo(0, 0);
    })
    .catch(error => {
      console.error('加载文章失败:', error);
      // 加载失败时显示错误信息
      const blogPost = document.getElementById('blogPost');
      if (blogPost) {
        blogPost.innerHTML = `<div class="error-message">文章加载失败: ${error.message}</div>`;
        document.getElementById('blogList').style.display = 'none';
        document.getElementById('blogPost').style.display = 'block';
      }
    });
}

// 简单的Markdown转HTML函数
function convertMarkdownToHtml(markdown) {
  // 这里使用一个非常简单的转换，实际使用建议用成熟的库如marked.js
  let html = markdown;

  // 转换标题
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');

  // 转换粗体和斜体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 转换链接
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // 转换图片
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');

  // 转换段落
  html = html.replace(/^\s*(\n)?(.+)/gm, function (m) {
    return /^<(\/)?(h\d|p|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
  });

  // 处理多余的空段落
  html = html.replace(/<p><\/p>/g, '');

  return html;
}

// 修改页面切换函数
function switchToList() {
  // 先将文章页面淡出
  const blogPost = document.getElementById('blogPost');
  blogPost.style.opacity = '0';

  // 等待淡出完成后隐藏文章页面并显示列表
  setTimeout(() => {
    blogPost.style.display = 'none';

    const blogList = document.getElementById('blogList');
    blogList.style.display = 'block';

    // 强制重排
    document.body.offsetHeight;

    // 淡入列表
    setTimeout(() => {
      blogList.style.opacity = '1';
    }, 10);
  }, 300);
}

function switchToPost() {
  // 先将列表页面淡出
  const blogList = document.getElementById('blogList');
  blogList.style.opacity = '0';

  // 等待淡出完成后隐藏列表页面并显示文章
  setTimeout(() => {
    blogList.style.display = 'none';

    const blogPost = document.getElementById('blogPost');
    blogPost.style.display = 'block';

    // 强制重排
    document.body.offsetHeight;

    // 淡入文章
    setTimeout(() => {
      blogPost.style.opacity = '1';
    }, 10);

    // 加载文章内容
    loadBlogPost();
  }, 300);
}