document.addEventListener('DOMContentLoaded', function() {
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
      'en': 'Learning'
    },
    'research': {
      'zh': '研究成果',
      'en': 'Research'
    },
    'contact': {
      'zh': '联系方式',
      'en': 'Contact'
    },
    'activities': {
      'zh': '个人活动',
      'en': 'Activities'
    },
    'welcome': {
      'zh': '欢迎来到我的宇宙空间',
      'en': 'Welcome to My Universe'
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
      'en': 'Exploring cutting-edge AI and ML technologies'
    },
    'llm': {
      'zh': '大语言模型',
      'en': 'Large Language Models'
    },
    'llm-desc': {
      'zh': '研究和应用大型语言模型的最新进展',
      'en': 'Researching and applying the latest in LLMs'
    },
    'data-analysis': {
      'zh': '数据分析',
      'en': 'Data Analysis'
    },
    'data-desc': {
      'zh': '使用数据科学方法解决复杂问题',
      'en': 'Solving complex problems with data science'
    },
    'recent-projects': {
      'zh': '最新项目',
      'en': 'Recent Projects'
    },
    'sentiment-analysis': {
      'zh': '基于BERT的情感分析',
      'en': 'BERT-based Sentiment Analysis'
    },
    'sentiment-desc': {
      'zh': '使用BERT模型对社交媒体文本进行情感分析和分类。',
      'en': 'Sentiment analysis and classification of social media text using BERT.'
    },
    'gpt-fine-tuning': {
      'zh': 'GPT模型微调研究',
      'en': 'GPT Model Fine-tuning Research'
    },
    'gpt-desc': {
      'zh': '针对特定领域对GPT模型进行微调，提升其在专业领域的表现。',
      'en': 'Fine-tuning GPT models for specific domains to enhance performance.'
    },
    'view-details': {
      'zh': '查看详情',
      'en': 'View Details'
    },
    'about-desc': {
      'zh': '我是邱月，华中科技大学计算机学院学生，研究兴趣是机器学习和大语言模型。',
      'en': 'I am Yue Qiu, a Computer Science student at HUST, interested in ML and LLMs.'
    },
    'quick-links': {
      'zh': '快速链接',
      'en': 'Quick Links'
    },
    'rights': {
      'zh': '保留所有权利',
      'en': 'All Rights Reserved'
    },
    'password-title': {
      'zh': '这是一个受密码保护的页面',
      'en': 'This is a password-protected page'
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
    }
  };

  // 切换语言函数
  function changeLanguage(lang) {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
      const key = element.getAttribute('data-lang-key');
      if (translations[key] && translations[key][lang]) {
        if (element.tagName === 'INPUT' && element.getAttribute('type') === 'placeholder') {
          element.placeholder = translations[key][lang];
        } else {
          element.textContent = translations[key][lang];
        }
      }
    });

    // 更新按钮状态
    document.getElementById('zh-btn').classList.toggle('active', lang === 'zh');
    document.getElementById('en-btn').classList.toggle('active', lang === 'en');
    
    // 保存语言选择到本地存储
    localStorage.setItem('language', lang);
  }

  // 初始化语言
  const savedLanguage = localStorage.getItem('language') || 'zh';
  changeLanguage(savedLanguage);

  // 添加点击事件监听器
  document.getElementById('zh-btn').addEventListener('click', () => changeLanguage('zh'));
  document.getElementById('en-btn').addEventListener('click', () => changeLanguage('en'));
}); 