// 椭圆轮播系统 - 完全复刻elliptical-rotation-chart设计
class EllipticalCarousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.itemsContainer = this.container.querySelector('.pos-systems-grid, .accessories-grid');
    this.items = Array.from(this.itemsContainer.children);
    this.itemCount = this.items.length;
    
    // 配置参数
    this.itemSpacing = this.getCSSVariableValue('--carousel-spacing');
    this.itemSize = this.getCSSVariableValue('--carousel-item-size');
    this.itemBoxLength = this.itemSize + this.itemSpacing; // 单个item的总宽度
    this.animationTime = 0.5;
    // 移除自动播放功能
    
    // 状态变量
    this.index = 0; // 当前索引
    this.timer = null;
    
    // 初始化
    this.init();
  }
  
  getCSSVariableValue(variableName) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .replace('vw', '')
      .trim();
    return parseFloat(value) || 0;
  }
  
  init() {
    if (this.itemCount === 0) return;
    
    // 初始化数组中元素的顺序，将最后一张图片放在第一位与html部分图片展示位置一致
    this.items.unshift(this.items.pop());
    
    // 设置初始样式
    this.itemsContainer.style.position = 'relative';
    this.itemsContainer.style.left = '0vw';
    this.itemsContainer.style.transition = `${this.animationTime}s ease`;
    
    // 设置最后一个元素的初始位置
    this.setupLastItemPosition();
    
    // 绑定事件
    this.bindEvents();
  }
  
  setupLastItemPosition() {
    const lastItem = this.getLastItem();
    if (lastItem) {
      const totalWidth = this.itemBoxLength * this.itemCount;
      lastItem.style.transform = `translateX(-${totalWidth}vw)`;
    }
  }
  
  getLastItem() {
    // 找到有特定ID的最后一个元素
    return this.items.find(item => 
      item.id === 'last-pos-item' || 
      item.id === 'last-accessory-item' ||
      item.classList.contains('last-item')
    );
  }
  
  moveToNext() {
    if (this.timer) return; // 防止重复点击
    
    this.index--;
    console.log('Next index:', this.index);
    
    // 先移动数组元素
    this.items.push(this.items.shift());
    
    // 处理移动后的最后一个元素位置（原来的第一个元素）
    this.handleNextLastItemPosition();
    
    // 移动整个容器
    this.itemsContainer.style.left = `${this.itemBoxLength * this.index}vw`;
    
    const lastItem = this.getLastItem();
    if (lastItem) {
      lastItem.style.transition = 'none';
    }
    
    // 检查是否需要重置
    if (Math.abs(this.index) >= this.itemCount) {
      setTimeout(() => {
        this.itemsContainer.style.transition = 'none';
        this.resetToStart();
        // 恢复过渡效果
        this.itemsContainer.style.transition = `${this.animationTime}s ease`;
      }, this.animationTime * 1000);
    }
  }
  
  moveToPrev() {
    if (this.timer) return; // 防止重复点击
    
    this.index++;
    console.log('Prev index:', this.index);
    
    // 先移动数组元素
    this.items.unshift(this.items.pop());
    
    // 处理新的第一个元素位置
    this.handlePrevItemPosition();
    
    // 移动整个容器
    this.itemsContainer.style.left = `${this.itemBoxLength * this.index}vw`;
    
    const lastItem = this.getLastItem();
    if (lastItem) {
      lastItem.style.transition = 'none';
    }
    
    // 检查是否需要重置
    if (Math.abs(this.index) >= this.itemCount) {
      setTimeout(() => {
        this.itemsContainer.style.transition = 'none';
        this.resetToStart();
        // 恢复过渡效果
        this.itemsContainer.style.transition = `${this.animationTime}s ease`;
      }, this.animationTime * 1000);
    }
  }
  
  handleNextLastItemPosition() {
    const lastItem = this.getLastItem();
    const movedToLastItem = this.items[this.items.length - 1]; // 新的最后一个元素（原来的第一个）
    
    if (movedToLastItem === lastItem) {
      lastItem.style.transition = 'none';
      lastItem.style.transform = 'translateX(0px)';
    } else if (this.index >= 0) {
      // 回退情况处理
      movedToLastItem.style.transform = 'none';
    } else {
      // 正常情况下，将移动到最后的元素设置正确位置
      const moveDistance = this.itemBoxLength * this.itemCount;
      movedToLastItem.style.transform = `translateX(${moveDistance}vw)`;
    }
  }

  handleNextItemPosition() {
    const lastItem = this.getLastItem();
    const firstItem = this.items[0];
    
    if (firstItem === lastItem) {
      lastItem.style.transition = 'none';
      lastItem.style.transform = 'translateX(0px)';
    } else if (this.index >= 0) {
      // 回退情况处理
      firstItem.style.transform = 'none';
    } else {
      // 正常情况下，将最左侧的图片移到最后
      const moveDistance = this.itemBoxLength * this.itemCount;
      firstItem.style.transform = `translateX(${moveDistance}vw)`;
    }
  }
  
  handlePrevItemPosition() {
    const lastItem = this.getLastItem();
    const firstItem = this.items[0];
    
    if (firstItem === lastItem && this.index !== 0) {
      // 当第一张图片为last-item时，特殊处理
      const moveDistance = this.itemBoxLength * this.itemCount * 2;
      firstItem.style.transform = `translateX(-${moveDistance}vw)`;
    } else if (this.index < 0) {
      // 回退情况
      firstItem.style.transform = 'none';
    } else {
      // 正常情况下，将最右侧的图片移到最前
      const moveDistance = this.itemBoxLength * this.itemCount;
      firstItem.style.transform = `translateX(-${moveDistance}vw)`;
    }
  }
  
  resetToStart() {
    this.index = 0;
    this.itemsContainer.style.left = '0vw';
    
    const lastItem = this.getLastItem();
    this.items.forEach(item => {
      if (item === lastItem) {
        const moveDistance = this.itemBoxLength * this.itemCount;
        item.style.transform = `translateX(-${moveDistance}vw)`;
      } else {
        item.style.transform = 'none';
      }
    });
  }
  
  // 自动播放功能已移除
  
  // 节流函数
  throttle(fn, delay) {
    return (...args) => {
      if (this.timer) return;
      
      fn.apply(this, args);
      this.timer = setTimeout(() => {
        this.timer = null;
      }, delay);
    };
  }
  
  bindEvents() {
    // 键盘控制
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.moveToPrev();
      if (e.key === 'ArrowRight') this.moveToNext();
    });
    
    // 触摸支持
    let startX = 0;
    let endX = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    this.container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.moveToNext();
        } else {
          this.moveToPrev();
        }
      }
    });
  }
}

// 轮播实例
let posCarousel = null;
let accessoriesCarousel = null;

// 全局移动函数（使用节流）
function moveCarousel(carouselType, direction) {
  if (carouselType === 'pos' && posCarousel) {
    const throttledMove = posCarousel.throttle(() => {
      direction > 0 ? posCarousel.moveToNext() : posCarousel.moveToPrev();
    }, posCarousel.animationTime * 1000);
    throttledMove();
  } else if (carouselType === 'accessories' && accessoriesCarousel) {
    const throttledMove = accessoriesCarousel.throttle(() => {
      direction > 0 ? accessoriesCarousel.moveToNext() : accessoriesCarousel.moveToPrev();
    }, accessoriesCarousel.animationTime * 1000);
    throttledMove();
  }
}

// 初始化轮播
document.addEventListener('DOMContentLoaded', () => {
  // 初始化收银系统轮播
  const posContainer = document.querySelector('.pos-systems-section .carousel-wrapper');
  if (posContainer) {
    posContainer.parentElement.id = 'pos-carousel-container';
    posCarousel = new EllipticalCarousel('pos-carousel-container');
  }
  
  // 初始化配件轮播
  const accessoriesContainer = document.querySelector('.accessories-section .carousel-wrapper');
  if (accessoriesContainer) {
    accessoriesContainer.parentElement.id = 'accessories-carousel-container';
    accessoriesCarousel = new EllipticalCarousel('accessories-carousel-container');
  }
});

// 窗口大小改变时重新计算
window.addEventListener('resize', () => {
  if (posCarousel) {
    posCarousel.itemSpacing = posCarousel.getCSSVariableValue('--carousel-spacing');
    posCarousel.itemSize = posCarousel.getCSSVariableValue('--carousel-item-size');
    posCarousel.itemBoxLength = posCarousel.itemSize + posCarousel.itemSpacing;
  }
  if (accessoriesCarousel) {
    accessoriesCarousel.itemSpacing = accessoriesCarousel.getCSSVariableValue('--carousel-spacing');
    accessoriesCarousel.itemSize = accessoriesCarousel.getCSSVariableValue('--carousel-item-size');
    accessoriesCarousel.itemBoxLength = accessoriesCarousel.itemSize + accessoriesCarousel.itemSpacing;
  }
});
