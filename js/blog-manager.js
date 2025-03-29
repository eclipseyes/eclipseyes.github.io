/**
 * 博客文章管理工具
 * 用于快速添加和管理博客文章
 */

const BlogManager = {
  // 配置信息
  config: {
    postsDirectory: '/blog/posts/',
    imagesDirectory: '/blog/images/',
    indexFile: '/blog/posts/index.json'
  },

  // 初始化管理工具
  init: function() {
    // 创建管理界面
    this.createManagerUI();
    // 加载现有文章
    this.loadExistingPosts();
  },

  // 创建管理界面
  createManagerUI: function() {
    // 检查是否已存在管理界面
    if (document.getElementById('blog-manager-panel')) return;

    // 创建管理面板
    const panel = document.createElement('div');
    panel.id = 'blog-manager-panel';
    panel.className = 'blog-manager-panel';
    
    // 添加面板内容
    panel.innerHTML = `
      <div class="blog-manager-header">
        <h2>博客文章管理</h2>
        <button id="blog-manager-close">×</button>
      </div>
      <div class="blog-manager-content">
        <div class="blog-manager-section">
          <h3>添加新文章</h3>
          <div class="form-group">
            <label for="post-id">文章ID (URL友好名称):</label>
            <input type="text" id="post-id" placeholder="例如: prompt-engineering">
          </div>
          <div class="form-group">
            <label for="post-title">文章标题:</label>
            <input type="text" id="post-title" placeholder="例如: LLM 技巧总结 | Prompt Engineering 指南">
          </div>
          <div class="form-group">
            <label for="post-date">发布日期:</label>
            <input type="date" id="post-date" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-group">
            <label for="post-tags">标签 (用逗号分隔):</label>
            <input type="text" id="post-tags" placeholder="例如: LLM, AI, Prompt Engineering">
          </div>
          <div class="form-group">
            <label for="post-summary">摘要:</label>
            <textarea id="post-summary" placeholder="简短描述文章内容..."></textarea>
          </div>
          <div class="form-group">
            <label for="post-cover">封面图片:</label>
            <input type="file" id="post-cover" accept="image/*">
            <div id="cover-preview" class="cover-preview"></div>
          </div>
          <div class="form-group">
            <label for="post-content">文章内容 (Markdown):</label>
            <textarea id="post-content" placeholder="# 文章标题\n\n内容..." rows="10"></textarea>
          </div>
          <div class="form-group">
            <label>或上传Markdown文件:</label>
            <input type="file" id="post-md-file" accept=".md">
          </div>
          <button id="btn-add-post" class="btn-primary">添加文章</button>
        </div>
        
        <div class="blog-manager-section">
          <h3>现有文章</h3>
          <div id="existing-posts" class="existing-posts">
            <p>加载中...</p>
          </div>
        </div>
      </div>
    `;
    
    // 添加到页面
    document.body.appendChild(panel);
    
    // 添加样式
    this.addStyles();
    
    // 绑定事件
    this.bindEvents();
  },
  
  // 添加管理界面样式
  addStyles: function() {
    const style = document.createElement('style');
    style.textContent = `
      .blog-manager-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 900px;
        max-height: 90vh;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.2);
        z-index: 1000;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .blog-manager-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: #4a6cf7;
        color: white;
      }
      
      .blog-manager-header h2 {
        margin: 0;
        font-size: 1.5rem;
      }
      
      #blog-manager-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.8rem;
        cursor: pointer;
      }
      
      .blog-manager-content {
        padding: 20px;
        overflow-y: auto;
        flex: 1;
      }
      
      .blog-manager-section {
        margin-bottom: 30px;
      }
      
      .form-group {
        margin-bottom: 15px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
      }
      
      .form-group input, .form-group textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      
      .form-group textarea {
        min-height: 100px;
        resize: vertical;
      }
      
      .btn-primary {
        background: #4a6cf7;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
      }
      
      .btn-primary:hover {
        background: #3a5ce5;
      }
      
      .cover-preview {
        margin-top: 10px;
        max-width: 300px;
        max-height: 200px;
        overflow: hidden;
        border-radius: 4px;
      }
      
      .cover-preview img {
        width: 100%;
        height: auto;
      }
      
      .existing-posts {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 10px;
      }
      
      .post-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
      }
      
      .post-item:last-child {
        border-bottom: none;
      }
      
      .post-item-info {
        flex: 1;
      }
      
      .post-item-title {
        font-weight: 500;
        margin-bottom: 5px;
      }
      
      .post-item-meta {
        font-size: 12px;
        color: #666;
      }
      
      .post-item-actions {
        display: flex;
        gap: 10px;
      }
      
      .btn-edit, .btn-delete {
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }
      
      .btn-edit {
        background: #f0f4ff;
        color: #4a6cf7;
        border: 1px solid #4a6cf7;
      }
      
      .btn-delete {
        background: #fff0f0;
        color: #f74a4a;
        border: 1px solid #f74a4a;
      }
    `;
    document.head.appendChild(style);
  },
  
  // 绑定事件处理
  bindEvents: function() {
    // 关闭按钮
    document.getElementById('blog-manager-close').addEventListener('click', () => {
      document.getElementById('blog-manager-panel').remove();
    });
    
    // 封面图片预览
    document.getElementById('post-cover').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = document.getElementById('cover-preview');
          preview.innerHTML = `<img src="${e.target.result}" alt="封面预览">`;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Markdown文件上传
    document.getElementById('post-md-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('post-content').value = e.target.result;
          
          // 尝试从Markdown提取标题和其他元数据
          const content = e.target.result;
          const titleMatch = content.match(/^#\s+(.+)$/m);
          if (titleMatch && titleMatch[1]) {
            document.getElementById('post-title').value = titleMatch[1];
            
            // 从标题生成ID
            const id = titleMatch[1]
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            document.getElementById('post-id').value = id;
          }
          
          // 提取摘要 (第一个非标题段落)
          const summaryMatch = content.match(/^(?!#)(.+)$/m);
          if (summaryMatch && summaryMatch[1]) {
            document.getElementById('post-summary').value = summaryMatch[1].trim();
          }
        };
        reader.readAsText(file);
      }
    });
    
    // 添加文章按钮
    document.getElementById('btn-add-post').addEventListener('click', () => {
      this.addNewPost();
    });
  },
  
  // 加载现有文章
  loadExistingPosts: function() {
    fetch(this.config.indexFile)
      .then(response => response.json())
      .then(posts => {
        const container = document.getElementById('existing-posts');
        
        if (posts.length === 0) {
          container.innerHTML = '<p>暂无文章</p>';
          return;
        }
        
        let html = '';
        posts.forEach(post => {
          html += `
            <div class="post-item" data-id="${post.id}">
              <div class="post-item-info">
                <div class="post-item-title">${post.title}</div>
                <div class="post-item-meta">
                  ${post.date} | 
                  ${post.tags ? post.tags.join(', ') : '无标签'}
                </div>
              </div>
              <div class="post-item-actions">
                <button class="btn-edit" data-id="${post.id}">编辑</button>
                <button class="btn-delete" data-id="${post.id}">删除</button>
              </div>
            </div>
          `;
        });
        
        container.innerHTML = html;
        
        // 绑定编辑和删除按钮事件
        document.querySelectorAll('.btn-edit').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            this.editPost(id);
          });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            this.deletePost(id);
          });
        });
      })
      .catch(error => {
        console.error('加载文章列表失败:', error);
        document.getElementById('existing-posts').innerHTML = 
          `<p>加载失败: ${error.message}</p>`;
      });
  },
  
  // 添加新文章
  addNewPost: function() {
    // 获取表单数据
    const id = document.getElementById('post-id').value.trim();
    const title = document.getElementById('post-title').value.trim();
    const date = document.getElementById('post-date').value;
    const tagsInput = document.getElementById('post-tags').value.trim();
    const summary = document.getElementById('post-summary').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const coverFile = document.getElementById('post-cover').files[0];
    
    // 验证必填字段
    if (!id || !title || !date || !summary || !content) {
      alert('请填写所有必填字段');
      return;
    }
    
    // 处理标签
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
    
    // 创建文章对象
    const post = {
      id,
      title,
      date,
      tags,
      summary
    };
    
    // 处理封面图片
    if (coverFile) {
      const coverFileName = `${id}-cover-${Date.now()}.${coverFile.name.split('.').pop()}`;
      post.coverImage = `blog/images/${coverFileName}`;
      
      // 这里应该上传图片到服务器，但在前端无法直接操作文件系统
      // 在实际应用中，需要通过API上传图片
      alert(`请将封面图片保存为: ${coverFileName} 并上传到 ${this.config.imagesDirectory} 目录`);
    }
    
    // 更新索引文件
    this.updateIndexFile(post)
      .then(() => {
        // 保存Markdown文件
        // 同样，在前端无法直接写入文件，需要通过API
        alert(`请将Markdown内容保存为: ${id}.md 并上传到 ${this.config.postsDirectory} 目录`);
        
        // 重新加载文章列表
        this.loadExistingPosts();
        
        // 清空表单
        this.resetForm();
      })
      .catch(error => {
        alert(`添加文章失败: ${error.message}`);
      });
  },
  
  // 更新索引文件
  updateIndexFile: function(newPost) {
    return fetch(this.config.indexFile)
      .then(response => response.json())
      .then(posts => {
        // 检查是否已存在同ID文章
        const existingIndex = posts.findIndex(post => post.id === newPost.id);
        
        if (existingIndex >= 0) {
          // 更新现有文章
          posts[existingIndex] = {...posts[existingIndex], ...newPost};
        } else {
          // 添加新文章
          posts.push(newPost);
        }
        
        // 按日期排序（从新到旧）
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 在实际应用中，这里应该通过API保存更新后的索引文件
        console.log('更新后的文章列表:', posts);
        alert('索引文件已更新，请将以下内容保存到 ' + this.config.indexFile + ':\n\n' + 
              JSON.stringify(posts, null, 2));
        
        return posts;
      });
  },
  
  // 编辑文章
  editPost: function(id) {
    fetch(this.config.indexFile)
      .then(response => response.json())
      .then(posts => {
        const post = posts.find(p => p.id === id);
        if (!post) {
          alert('找不到该文章');
          return;
        }
        
        // 填充表单
        document.getElementById('post-id').value = post.id;
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-date').value = post.date;
        document.getElementById('post-tags').value = post.tags ? post.tags.join(', ') : '';
        document.getElementById('post-summary').value = post.summary;
        
        // 显示封面预览
        if (post.coverImage) {
          const preview = document.getElementById('cover-preview');
          preview.innerHTML = `<img src="/${post.coverImage}" alt="封面预览">`;
        }
        
        // 加载Markdown内容
        fetch(`${this.config.postsDirectory}${post.id}.md`)
          .then(response => response.text())
          .then(content => {
            document.getElementById('post-content').value = content;
          })
          .catch(() => {
            alert('无法加载文章内容，请手动填写');
          });
      })
      .catch(error => {
        alert(`加载文章失败: ${error.message}`);
      });
  },
  
  // 删除文章
  deletePost: function(id) {
    if (!confirm(`确定要删除文章 "${id}" 吗？此操作不可撤销。`)) {
      return;
    }
    
    fetch(this.config.indexFile)
      .then(response => response.json())
      .then(posts => {
        // 过滤掉要删除的文章
        const updatedPosts = posts.filter(post => post.id !== id);
        
        // 在实际应用中，这里应该通过API保存更新后的索引文件
        // 并删除对应的Markdown文件和封面图片
        console.log('更新后的文章列表:', updatedPosts);
        alert('索引文件已更新，请将以下内容保存到 ' + this.config.indexFile + ':\n\n' + 
              JSON.stringify(updatedPosts, null, 2) + 
              '\n\n同时请删除文件: ' + this.config.postsDirectory + id + '.md');
        
        // 重新加载文章列表
        this.loadExistingPosts();
      })
      .catch(error => {
        alert(`删除文章失败: ${error.message}`);
      });
  },
  
  // 重置表单
  resetForm: function() {
    document.getElementById('post-id').value = '';
    document.getElementById('post-title').value = '';
    document.getElementById('post-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('post-tags').value = '';
    document.getElementById('post-summary').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-cover').value = '';
    document.getElementById('post-md-file').value = '';
    document.getElementById('cover-preview').innerHTML = '';
  }
};

// 添加启动按钮
function addBlogManagerButton() {
  const button = document.createElement('button');
  button.id = 'blog-manager-btn';
  button.innerHTML = '<i class="fas fa-edit"></i> 管理博客';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4a6cf7;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  
  button.addEventListener('click', function() {
    BlogManager.init();
  });
  
  document.body.appendChild(button);
}

// 在页面加载完成后添加按钮
document.addEventListener('DOMContentLoaded', function() {
  // 只在管理员模式下显示按钮
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (isAdmin) {
    addBlogManagerButton();
  }
  
  // 添加管理员模式切换快捷键 (Ctrl+Shift+A)
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      const currentStatus = localStorage.getItem('isAdmin') === 'true';
      localStorage.setItem('isAdmin', !currentStatus);
      alert(`管理员模式: ${!currentStatus ? '已启用' : '已禁用'}`);
      location.reload();
    }
  });
}); 