// 使用手册页面交互功能

document.addEventListener('DOMContentLoaded', function() {
    initManualNavigation();
    initScrollToSection();
    initActiveNavigation();
    
    // 如果没有hash，默认激活第一个导航项
    if (!window.location.hash) {
        const firstNavItem = document.querySelector('.sidebar-nav .nav-item');
        if (firstNavItem) {
            firstNavItem.classList.add('active');
        }
    }
});

// 初始化手册导航
function initManualNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            const sectionElement = document.getElementById(targetSection);
            
            if (sectionElement) {
                // 更新导航状态
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // 计算目标位置，添加偏移量确保章节标题完全可见
                const elementTop = sectionElement.offsetTop;
                const offset = 25; // 为导航栏和一些额外空间留出位置
                const targetPosition = elementTop - offset;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'instant'
                });
                
                // 更新URL hash
                window.history.pushState(null, null, `#${targetSection}`);
            }
        });
    });
}

// 初始化滚动到章节功能
function initScrollToSection() {
    // 检查URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetSection = document.getElementById(hash);
        const targetNav = document.querySelector(`[data-section="${hash}"]`);
        
        if (targetSection && targetNav) {
            // 更新导航状态
            document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => nav.classList.remove('active'));
            targetNav.classList.add('active');
            
            // 延迟滚动，确保页面完全加载
            setTimeout(() => {
                const elementTop = targetSection.offsetTop;
                const offset = 140; // 与导航点击使用相同的偏移量
                const targetPosition = elementTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
}

// 初始化活动导航监听
function initActiveNavigation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const correspondingNav = document.querySelector(`[data-section="${sectionId}"]`);
                if (correspondingNav) {
                    document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => nav.classList.remove('active'));
                    correspondingNav.classList.add('active');
                    // 更新URL hash而不触发滚动
                    const newUrl = `${window.location.pathname}#${sectionId}`;
                    window.history.replaceState(null, null, newUrl);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });
    // 观察所有章节
    document.querySelectorAll('.manual-section').forEach(section => {
        observer.observe(section);
    });

    // 监听页面滚动，顶部时高亮cash-register
    window.addEventListener('scroll', function() {
        if (window.scrollY < 400) {
            document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => nav.classList.remove('active'));
            const firstNav = document.querySelector('.sidebar-nav .nav-item[data-section="cash-register"]');
            if (firstNav) firstNav.classList.add('active');
            // 只更新hash，不滚动
            const newUrl = `${window.location.pathname}#cash-register`;
            window.history.replaceState(null, null, newUrl);
        }
    });
}

// 平滑滚动到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 监听浏览器后退/前进按钮
window.addEventListener('popstate', function() {
    initScrollToSection();
});