/**
 * 博客内容加载器
 * 用于加载和显示博客内容
 */

// 博客内容加载器
const BlogContentLoader = {
  // 博客文章列表缓存
  postsCache: null,

  // 加载博客文章列表
  loadBlogList: async function () {
    try {
      // 如果已经有缓存，直接使用缓存
      if (this.postsCache) {
        return this.postsCache;
      }

      // 从静态 JSON 文件加载文章列表
      const response = await fetch('/blog/posts/index.json');
      if (!response.ok) {
        throw new Error('无法加载博客索引');
      }

      const posts = await response.json();
      this.postsCache = posts;
      return posts;
    } catch (error) {
      console.error('加载博客列表失败:', error);
      return [];
    }
  },

  // 加载单篇文章内容
  loadBlogPost: async function (postId) {
    try {
      const url = `/blog/posts/${postId}.md`;
      console.log('尝试加载文章:', url);

      // 加载 Markdown 内容
      const response = await fetch(url);
      console.log('文章加载状态:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error('文章不存在');
      }

      // 获取原始 Markdown
      const markdown = await response.text();

      // 使用 marked.js 进行渲染
      const html = marked.parse(markdown, {
        gfm: true,
        breaks: true,
        smartLists: true,
        smartypants: true,
        highlight: function (code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(code, { language: lang }).value;
            } catch (e) { }
          }
          return hljs.highlightAuto(code).value;
        }
      });

      return {
        content: html,
        metadata: await this.getPostMetadata(postId)
      };
    } catch (error) {
      console.error('加载博客文章失败:', error);
      return null;
    }
  },

  // 获取文章元数据
  getPostMetadata: async function (postId) {
    const posts = await this.loadBlogList();
    return posts.find(post => post.id === postId) || {};
  },

  // 渲染博客列表到页面
  renderBlogList: async function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<div class="loading">加载中...</div>';

    try {
      const posts = await this.loadBlogList();

      if (posts.length === 0) {
        container.innerHTML = '<div class="empty-message">暂无博客文章</div>';
        return;
      }

      // 生成HTML
      let html = '<div class="blog-grid">';

      posts.forEach(post => {
        html += `
          <div class="blog-card">
            <div class="blog-card-image">
              <img src="${post.coverImage || '/blog/images/default-cover.jpg'}" alt="${post.title}">
            </div>
            <div class="blog-card-content">
              <h3>${post.title}</h3>
              <div class="blog-meta">
                <span class="date">${post.date}</span>
                ${post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
              </div>
              <p>${post.summary}</p>
              <a href="#post/${post.id}" class="read-more-btn">阅读更多</a>
            </div>
          </div>
        `;
      });

      html += '</div>';
      container.innerHTML = html;
    } catch (error) {
      container.innerHTML = `<div class="error-message">加载博客列表失败: ${error.message}</div>`;
    }
  },

  // 渲染文章内容到页面
  renderBlogPost: async function (postId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<div class="loading">文章加载中...</div>';

    try {
      const result = await this.loadBlogPost(postId);

      if (!result) {
        container.innerHTML = '<div class="error-message">无法加载文章内容</div>';
        return;
      }

      const { content, metadata } = result;

      // 更新页面标题
      document.title = `${metadata.title || '博客文章'} - Eclipseyes`;

      // 渲染文章内容
      container.innerHTML = `
        <div class="blog-post-container">
          <div class="blog-meta-header">
            <h1>${metadata.title || '无标题'}</h1>
            <div class="meta">
              <span class="date">${metadata.date || ''}</span>
              ${metadata.tags ? metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
            </div>
          </div>
          <div class="markdown-body">
            ${content}
          </div>
          <div class="blog-post-footer">
            <a href="#" class="btn btn-back">返回文章列表</a>
          </div>
        </div>
      `;

      // 添加返回按钮事件监听
      const backBtn = container.querySelector('.btn-back');
      if (backBtn) {
        backBtn.addEventListener('click', function (event) {
          event.preventDefault();
          // 只设置 hash，不直接调用 showBlogList
          // 让 hashchange 事件处理程序统一处理视图切换
          window.location.hash = '';
        });
      }

      // 代码高亮
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });

      // 修复图片路径
      this.fixImagePaths();

      // 文章渲染完成后生成目录
      if (window.BlogTOC && typeof window.BlogTOC.generate === 'function') {
        setTimeout(() => {
          window.BlogTOC.generate();
        }, 100);
      }
    } catch (error) {
      container.innerHTML = `<div class="error-message">加载文章失败: ${error.message}</div>`;
    }
  },

  // 显示博客列表
  showBlogList: function (listContainerId = 'blogList', postContainerId = 'blogPost', retryCount = 0) {
    console.log(`显示博客列表(尝试 ${retryCount + 1}/3)`);

    const listContainer = document.getElementById(listContainerId);
    const postContainer = document.getElementById(postContainerId);

    if (!listContainer || !postContainer) {
      console.error('找不到容器元素:', { listContainerId, postContainerId });

      // 添加重试机制
      if (retryCount < 2) {
        setTimeout(() => {
          this.showBlogList(listContainerId, postContainerId, retryCount + 1);
        }, 100);
      }
      return;
    }

    // 先显示容器元素
    listContainer.style.display = 'block';
    postContainer.style.display = 'none';

    // 添加短暂延迟来确保DOM更新
    setTimeout(() => {
      this.renderBlogList(listContainerId);
    }, 50);
  },

  // 显示博客文章
  showBlogPost: function (postId, listContainerId = 'blogList', postContainerId = 'blogPost', retryCount = 0) {
    console.log(`尝试显示文章(尝试 ${retryCount + 1}/3):`, postId);

    const listContainer = document.getElementById(listContainerId);
    const postContainer = document.getElementById(postContainerId);

    if (!listContainer || !postContainer) {
      console.error('找不到容器元素:', { listContainerId, postContainerId });

      // 如果DOM元素不存在且未超过重试次数，进行重试
      if (retryCount < 2) {
        setTimeout(() => {
          this.showBlogPost(postId, listContainerId, postContainerId, retryCount + 1);
        }, 100);
      }
      return;
    }

    listContainer.style.display = 'none';
    postContainer.style.display = 'block';
    this.renderBlogPost(postId, postContainerId);
  },

  // 监听 URL 哈希变化，切换博客列表和文章
  initBlogSystem: function () {
    // 立即检查当前URL并加载内容
    this.handleUrlChange();

    // 初始加载
    window.addEventListener('DOMContentLoaded', () => {
      // 确保在DOM加载完成后再次检查
      this.handleUrlChange();
    });

    // 监听哈希变化
    window.addEventListener('hashchange', () => {
      this.handleUrlChange();
    });
  },

  // 添加一个新方法处理URL变化
  handleUrlChange: function () {
    console.log('处理URL变化:', location.hash);

    // 避免在已加载状态下重复处理
    if (this._isProcessingURLChange) {
      console.log('URL处理已在进行中，跳过');
      return;
    }

    this._isProcessingURLChange = true;

    try {
      if (location.hash.startsWith('#post/')) {
        const postId = location.hash.replace('#post/', '');
        console.log('加载文章:', postId);

        // 添加短暂延迟确保DOM已准备好
        setTimeout(() => {
          this.showBlogPost(postId);
          this._isProcessingURLChange = false;
        }, 50);
      } else {
        console.log('加载博客列表');

        // 添加短暂延迟确保DOM已准备好
        setTimeout(() => {
          this.showBlogList();
          this._isProcessingURLChange = false;
        }, 50);
      }
    } catch (e) {
      console.error('处理URL变化时出错:', e);
      this._isProcessingURLChange = false;
    }
  },

  // 修复图片路径
  fixImagePaths: function () {
    // 查找所有图片
    const images = document.querySelectorAll('.markdown-body img');

    images.forEach(function (img) {
      // 添加加载事件
      img.addEventListener('load', function () {
        img.classList.add('loaded');
      });

      img.addEventListener('error', function () {
        // 图片加载失败时显示替代图像
        img.src = '/blog/images/image-placeholder.png';
      });

      // 检查是否是相对路径
      const src = img.getAttribute('src');
      if (src && src.includes('../images/')) {
        // 替换路径 ../images/ -> /blog/images/
        img.src = src.replace('../images/', '/blog/images/');
      }
    });
  }
};

// 初始化博客系统
BlogContentLoader.initBlogSystem(); 