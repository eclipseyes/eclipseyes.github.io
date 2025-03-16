window.translations = null;

document.addEventListener('DOMContentLoaded', function () {
  // 语言配置
  const translations = {
    'home': {
      'zh': '首页',
      'en': 'Home'
    },
    'about': {
      'zh': '关于我',
      'en': 'About'
    },
    'projects': {
      'zh': '项目展示',
      'en': 'Projects'
    },
    'blog': {
      'zh': '学习分享',
      'en': 'Blog'
    },
    'research': {
      'zh': '研究成果',
      'en': 'Research'
    },
    'contact': {
      'zh': '留言板',
      'en': 'Guestbook'
    },
    'activities': {
      'zh': '个人活动',
      'en': 'Activities'
    },
    'welcome': {
      'zh': '欢迎来到我的空间',
      'en': 'Welcome to My Space'
    },
    'intro': {
      'zh': '在这里，我分享我的项目、研究和学习经验',
      'en': 'Here I share my projects, research and learning experiences'
    },
    'learn-more': {
      'zh': '了解更多',
      'en': 'Learn More'
    },
    'machine-learning': {
      'zh': '机器学习',
      'en': 'Machine Learning'
    },
    'ml-desc': {
      'zh': '探索人工智能和机器学习的前沿技术',
      'en': 'Exploring cutting-edge AI and machine learning technologies'
    },
    'llm': {
      'zh': '大语言模型',
      'en': 'Large Language Models'
    },
    'llm-desc': {
      'zh': '研究和应用大型语言模型的最新进展',
      'en': 'Researching and applying the latest advances in large language models'
    },
    'data-analysis': {
      'zh': '数据分析',
      'en': 'Data Analysis'
    },
    'data-desc': {
      'zh': '使用数据科学方法解决复杂问题',
      'en': 'Solving complex problems with data science methods'
    },
    'recent-projects': {
      'zh': '最新项目',
      'en': 'Recent Projects'
    },
    'about-desc': {
      'zh': '我是邱月，华中科技大学计算机学院学生，研究兴趣是机器学习和大语言模型。',
      'en': 'I am Yue Qiu, a computer science student at HUST. My research interests are machine learning and large language models.'
    },
    'quick-links': {
      'zh': '快速链接',
      'en': 'Quick Links'
    },
    'rights': {
      'zh': '保留所有权利',
      'en': 'All Rights Reserved'
    },
    'bio': {
      'zh': '我是邱月，昵称 eclipseyes ～，现在在华中科技大学计算机学院读本科。正在学习和研究NLP相关～',
      'en': 'I am Yue Qiu, also known as eclipseyes. Currently I\'m an undergraduate student at Huazhong University of Science and Technology, School of Computer Science. Learning and researching NLP related topics.'
    },
    'education': {
      'zh': '教育背景',
      'en': 'Education'
    },
    'skills': {
      'zh': '技能专长',
      'en': 'Skills'
    },
    'research-interests': {
      'zh': '研究兴趣',
      'en': 'Research Interests'
    },
    'password-title': {
      'zh': '这是一个受密码保护的页面',
      'en': 'This is a password protected page'
    },
    'password-placeholder': {
      'zh': '请输入密码',
      'en': 'Enter password'
    },
    'submit': {
      'zh': '提交',
      'en': 'Submit'
    },
    'password-error': {
      'zh': '密码错误，请重试',
      'en': 'Incorrect password, please try again'
    },
    'guestbook': {
      'zh': '留言板',
      'en': 'Guestbook'
    },
    'empty-notice': {
      'zh': 'QwQ 等待上新哦~',
      'en': 'QwQ Coming soon~'
    },
    'chongqing-nankai': {
      'zh': '重庆南开中学 高中',
      'en': 'Chongqing Nankai Secondary School (High School)'
    },
    'hust-cs': {
      'zh': '华中科技大学 计算机科学与技术专业 在读本科',
      'en': 'Huazhong University of Science and Technology, Undergraduate of Computer Science'
    },
    'machine-learning-skill': {
      'zh': '机器学习',
      'en': 'Machine Learning'
    },
    'python-skill': {
      'zh': 'Python',
      'en': 'Python'
    },
    'deep-learning-skill': {
      'zh': '深度学习',
      'en': 'Deep Learning'
    },
    'data-analysis-skill': {
      'zh': '数据分析',
      'en': 'Data Analysis'
    },
    'llm-finetuning': {
      'zh': '大语言模型的微调与部署',
      'en': 'LLM Fine-tuning and Deployment'
    },
    'nlp': {
      'zh': '自然语言处理',
      'en': 'Natural Language Processing'
    },
    'multimodal': {
      'zh': '多模态学习',
      'en': 'Multimodal Learning'
    },
    'leave-message': {
      'zh': '留下您的留言',
      'en': 'Leave Your Message'
    },
    'nickname': {
      'zh': '昵称',
      'en': 'Nickname'
    },
    'email-private': {
      'zh': '邮箱 (不会公开)',
      'en': 'Email (will not be public)'
    },
    'message-content': {
      'zh': '留言内容',
      'en': 'Message'
    },
    'post-comment': {
      'zh': '发布留言',
      'en': 'Post'
    },
    'all-comments': {
      'zh': '所有留言',
      'en': 'All Comments'
    },
    'no-comments': {
      'zh': '暂无留言，快来发表第一条留言吧！',
      'en': 'No comments yet. Be the first to leave a message!'
    },
    'douban-activity': {
      'zh': '豆瓣活动',
      'en': 'Douban Activities'
    },
    'edx-courses': {
      'zh': 'EDX课程',
      'en': 'EDX Courses'
    },
    'other-activities': {
      'zh': '其他活动',
      'en': 'Other Activities'
    },
    'close-modal-hint': {
      'zh': '点击右上角关闭按钮可返回主页',
      'en': 'Click the close button in the top right to return to homepage'
    }
  };

  // 使translations全局可用
  window.translations = translations;

  // 切换语言函数
  function changeLanguage(lang) {
    // 更新语言按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(lang + '-btn').classList.add('active');

    // 更新文本内容
    document.querySelectorAll('[data-lang-key]').forEach(element => {
      const key = element.getAttribute('data-lang-key');
      if (translations[key] && translations[key][lang]) {
        element.textContent = translations[key][lang];
      }
    });

    // 保存语言选择到本地存储
    localStorage.setItem('language', lang);

    // 当切换到英文时，为标题元素添加lang属性
    if (lang === 'en') {
      const titles = document.querySelectorAll('h1, h2, h3, h4, [data-lang-key]');
      titles.forEach(element => {
        element.setAttribute('lang', 'en');
      });
    } else {
      // 切换回中文时移除lang属性
      const elements = document.querySelectorAll('[lang="en"]');
      elements.forEach(element => {
        element.removeAttribute('lang');
      });
    }
  }

  // 初始化语言
  const savedLanguage = localStorage.getItem('language') || 'zh';
  changeLanguage(savedLanguage);

  // 添加点击事件监听器
  document.getElementById('zh-btn').addEventListener('click', () => changeLanguage('zh'));
  document.getElementById('en-btn').addEventListener('click', () => changeLanguage('en'));
}); 