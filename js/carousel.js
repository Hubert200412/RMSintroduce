// 优化的无缝循环轮播
class SmoothCarousel {
    constructor() {
        this.carousels = new Map();
        this.itemsPerView = 3;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        // 初始化所有轮播
        this.initCarousel('pos', 'pos-carousel');
        this.initCarousel('accessories', 'accessories-carousel');
        
        // 添加事件监听
        this.addEventListeners();
        
        // 响应式处理
        this.handleResize();
        
        // 启动自动播放
        this.startAutoPlay();
    }

    initCarousel(type, carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const originalItems = Array.from(carousel.children);
        const totalItems = originalItems.length;
        
        if (totalItems <= this.itemsPerView) {
            this.hideNavigationButtons(type);
            return;
        }

        // 创建无缝循环所需的克隆
        this.setupInfiniteClones(carousel, originalItems);
        
        // 初始化轮播数据
        const carouselData = {
            element: carousel,
            totalItems: totalItems,
            currentIndex: this.itemsPerView, // 从第一个真实元素开始
            isTransitioning: false,
            itemWidth: 0,
            clonesBefore: this.itemsPerView,
            clonesAfter: this.itemsPerView
        };
        
        this.carousels.set(type, carouselData);
        
        // 设置初始位置
        this.updateItemWidth(type);
        this.setPosition(type, false);
        
        // 添加过渡结束监听
        this.addTransitionEndListener(type);
    }

    setupInfiniteClones(carousel, originalItems) {
        const fragment = document.createDocumentFragment();
        
        // 在开头添加末尾几个元素的克隆
        for (let i = originalItems.length - this.itemsPerView; i < originalItems.length; i++) {
            const clone = originalItems[i].cloneNode(true);
            clone.classList.add('carousel-clone', 'clone-before');
            fragment.appendChild(clone);
        }
        
        // 添加所有原始元素
        originalItems.forEach(item => fragment.appendChild(item));
        
        // 在末尾添加开头几个元素的克隆
        for (let i = 0; i < this.itemsPerView; i++) {
            const clone = originalItems[i].cloneNode(true);
            clone.classList.add('carousel-clone', 'clone-after');
            fragment.appendChild(clone);
        }
        
        // 清空轮播并添加新结构
        carousel.innerHTML = '';
        carousel.appendChild(fragment);
    }

    updateItemWidth(type) {
        const data = this.carousels.get(type);
        if (!data) return;
        
        const firstItem = data.element.children[0];
        if (!firstItem) return;
        
        const computedStyle = window.getComputedStyle(firstItem);
        const gap = 30; // CSS中的gap值
        data.itemWidth = firstItem.offsetWidth + gap;
    }

    setPosition(type, animate = true) {
        const data = this.carousels.get(type);
        if (!data) return;
        
        const translateX = -(data.currentIndex * data.itemWidth);
        
        if (animate) {
            data.element.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        } else {
            data.element.style.transition = 'none';
        }
        
        data.element.style.transform = `translateX(${translateX}px)`;
        
        if (!animate) {
            // 强制重排后恢复过渡
            requestAnimationFrame(() => {
                data.element.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            });
        }
    }

    moveCarousel(type, direction) {
        if (this.isAnimating) return;
        
        const data = this.carousels.get(type);
        if (!data || data.isTransitioning) return;
        
        this.isAnimating = true;
        data.isTransitioning = true;
        
        // 更新当前索引
        data.currentIndex += direction;
        
        // 执行动画
        this.setPosition(type, true);
        
        // 重置自动播放
        this.resetAutoPlay();
    }

    addTransitionEndListener(type) {
        const data = this.carousels.get(type);
        if (!data) return;
        
        data.element.addEventListener('transitionend', (e) => {
            if (e.propertyName !== 'transform' || !data.isTransitioning) return;
            
            data.isTransitioning = false;
            this.isAnimating = false;
            
            // 检查是否需要重置位置
            this.handleInfiniteLoop(type);
        });
    }

    handleInfiniteLoop(type) {
        const data = this.carousels.get(type);
        if (!data) return;
        
        const maxIndex = data.totalItems + data.clonesBefore;
        const minIndex = data.clonesBefore;
        
        let needsReset = false;
        let newIndex = data.currentIndex;
        
        if (data.currentIndex >= maxIndex) {
            // 从末尾重置到开头
            newIndex = minIndex;
            needsReset = true;
        } else if (data.currentIndex < minIndex) {
            // 从开头重置到末尾
            newIndex = maxIndex - 1;
            needsReset = true;
        }
        
        if (needsReset) {
            data.currentIndex = newIndex;
            this.setPosition(type, false);
        }
    }

    hideNavigationButtons(type) {
        const carousel = document.getElementById(`${type}-carousel`);
        if (!carousel) return;
        
        const container = carousel.closest('.carousel-container');
        if (container) {
            const buttons = container.querySelectorAll('.carousel-btn');
            buttons.forEach(btn => btn.style.display = 'none');
        }
    }

    addEventListeners() {
        // 键盘支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.moveCarousel('pos', -1);
                this.moveCarousel('accessories', -1);
            } else if (e.key === 'ArrowRight') {
                this.moveCarousel('pos', 1);
                this.moveCarousel('accessories', 1);
            }
        });

        // 窗口大小变化
        window.addEventListener('resize', () => this.handleResize());
        
        // 触摸支持
        this.addTouchSupport();
        
        // 鼠标悬停暂停自动播放
        this.addHoverPause();
    }

    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let activeCarousel = null;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            activeCarousel = e.target.closest('.carousel-container');
        };

        const handleTouchMove = (e) => {
            if (!isDragging || !activeCarousel) return;
            currentX = e.touches[0].clientX;
            e.preventDefault();
        };

        const handleTouchEnd = () => {
            if (!isDragging || !activeCarousel) return;
            isDragging = false;

            const deltaX = startX - currentX;
            const threshold = 80;

            if (Math.abs(deltaX) > threshold) {
                const direction = deltaX > 0 ? 1 : -1;
                const type = activeCarousel.querySelector('#pos-carousel') ? 'pos' : 'accessories';
                this.moveCarousel(type, direction);
            }
            
            activeCarousel = null;
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    addHoverPause() {
        document.querySelectorAll('.carousel-container').forEach(container => {
            container.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });
            
            container.addEventListener('mouseleave', () => {
                this.resumeAutoPlay();
            });
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (!this.isAnimating) {
                this.moveCarousel('pos', 1);
                setTimeout(() => {
                    if (!this.isAnimating) {
                        this.moveCarousel('accessories', 1);
                    }
                }, 3000);
            }
        }, 8000);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlay() {
        if (!this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.resumeAutoPlay();
    }

    handleResize() {
        const width = window.innerWidth;
        const newItemsPerView = width <= 768 ? 1 : width <= 1024 ? 2 : 3;
        
        if (newItemsPerView !== this.itemsPerView) {
            this.itemsPerView = newItemsPerView;
            this.destroy();
            setTimeout(() => this.init(), 100);
        } else {
            // 更新项目宽度和位置
            this.carousels.forEach((data, type) => {
                this.updateItemWidth(type);
                this.setPosition(type, false);
            });
        }
    }

    destroy() {
        this.pauseAutoPlay();
        
        // 清理所有克隆元素并恢复原始结构
        this.carousels.forEach((data, type) => {
            const carousel = data.element;
            const originalItems = Array.from(carousel.children).filter(
                child => !child.classList.contains('carousel-clone')
            );
            
            carousel.innerHTML = '';
            originalItems.forEach(item => carousel.appendChild(item));
        });
        
        this.carousels.clear();
    }
}

// 全局函数供HTML调用
function moveCarousel(type, direction) {
    if (window.smoothCarousel) {
        window.smoothCarousel.moveCarousel(type, direction);
    }
}

// 初始化轮播
document.addEventListener('DOMContentLoaded', () => {
    window.smoothCarousel = new SmoothCarousel();
});
