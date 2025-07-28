// 正确初始化AOS动画库
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// AOS初始化后延迟执行锚点跳转，确保内容已渲染
setTimeout(function () {
    if (window.location.hash === '#partners') {
        var el = document.getElementById('partners');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
}, 500);

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});




// 粒子文字动画功能
// 如何引用功能：
// import { particleTextAnimation } from './js/about.js';
// particleTextAnimation({ canvasId: 'movingText', text: '关于我们' });

export function particleTextAnimation({
    canvasId = 'movingText',
    text = '关于我们',
    font = '30px fangsong',
    textColor = 'rgb(255,255,255,1)',
    canvasHeight = 300
} = {}) {
    window.addEventListener('DOMContentLoaded', function () {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.font = font;
        ctx.fillStyle = textColor;
        // 测量文字宽度
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, 0, 30, 180);
        const pix = ctx.getImageData(0, 0, ctx.measureText(text).width, 35);
        function canvasResize() {
            canvas.width = window.innerWidth - 200;
            canvas.height = canvasHeight;
        }
        canvasResize();
        // 居中，基于像素区域
        const cx = canvas.width / 2 - 290;
        const cy = canvas.height / 2 - pix.height;
        class Particle {
            constructor() {
                this.arr = [];
            }
            init() {
                for (let i = 0; i < pix.data.length / 4; i++) {
                    const x = i % pix.width;
                    const y = Math.floor(i / pix.width);
                    this.arr.push({
                        x: x,
                        y: y,
                        alpha: pix.data[i * 4 + 3],
                        mx: Math.random() * canvas.width,
                        my: Math.random() * canvas.height,
                        radius: Math.random() * 3 + 2,
                        speed: 15,
                        color: `rgba(${Math.random() * 60}, ${Math.random() * 60}, ${Math.random() * 60 + 30},${pix.data[i * 4 + 3] / 255})`
                    })
                }
            }
            draw() {
                this.arr.forEach(item => {
                    ctx.beginPath();
                    ctx.fillStyle = item.color;
                    ctx.arc(item.mx, item.my, item.radius, 0, Math.PI * 2, false);
                    ctx.fill();
                })
            }
            update() {
                for (let i = 0; i < this.arr.length; i++) {
                    this.arr[i].mx = this.arr[i].mx + ((this.arr[i].x * 5 + cx) - this.arr[i].mx) / this.arr[i].speed;
                    this.arr[i].my = this.arr[i].my + ((this.arr[i].y * 5 + cy) - this.arr[i].my) / this.arr[i].speed;
                }
            }
            isGathered(threshold = 2) {
                // 判断所有粒子是否都聚合到目标点附近
                return this.arr.every(item => {
                    const dx = item.mx - (item.x * 5 + cx);
                    const dy = item.my - (item.y * 5 + cy);
                    return Math.abs(dx) < threshold && Math.abs(dy) < threshold;
                });
            }
        }
        const particle = new Particle();
        particle.init();
        let animationFrameId;
        let gathered = false;
        let gatherCount = 0;
        let transition = false;
        let transitionFrame = 0;
        const transitionTotalFrames = 10;
        function step() {
            ctx.fillStyle = "rgba(255,140,0,1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (!gathered && !transition) {
                particle.draw();
                particle.update();
                if (particle.isGathered()) {
                    gatherCount++;
                    // 粒子聚合后保持一段时间
                    if (gatherCount > 30) {
                        transition = true;
                        transitionFrame = 0;
                    }
                }
                animationFrameId = window.requestAnimationFrame(step);
            } else if (transition) {
                // 过渡阶段：粒子逐渐消失，文字逐渐显现
                // 计算当前透明度
                let t = transitionFrame / transitionTotalFrames;
                // 粒子透明度从1到0，文字透明度从0到1
                // 画粒子
                particle.arr.forEach(item => {
                    ctx.beginPath();
                    // 取原色，调整alpha
                    let color = item.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/, function (_, r, g, b, a) {
                        return `rgba(${r},${g},${b},${(1 - t) * parseFloat(a)})`;
                    });
                    ctx.fillStyle = color;
                    ctx.arc(item.mx, item.my, item.radius, 0, Math.PI * 2, false);
                    ctx.fill();
                });
                // 画文字
                ctx.save();
                ctx.globalAlpha = t;
                ctx.font = 'bold 160px fangsong';
                ctx.fillStyle = 'rgb(30,30,60,1)';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 56);
                ctx.restore();
                transitionFrame++;
                if (transitionFrame > transitionTotalFrames) {
                    transition = false;
                    gathered = true;
                }
                animationFrameId = window.requestAnimationFrame(step);
            } else {
                // 过渡结束，直接显示文字
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = 'bold 160px fangsong';
                ctx.fillStyle = 'rgb(30,30,60,1)';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 56);
            }
        }
        animationFrameId = window.requestAnimationFrame(step);
    });
}

// 动态加载新闻列表
fetch('js/news-data.json')
    .then(res => res.json())
    .then(data => {
        const newsGrid = document.querySelector('.news-grid');
        newsGrid.innerHTML = data.map((item, idx) => `
      <div class="news-card${idx === 0 ? ' featured' : ''}" data-aos="fade-up" data-aos-delay="${idx * 100}">
        <div class="news-image">
          <div class="news-placeholder">
            <img src="${item.image}" alt="${item.title}" style="width:100%;object-fit:cover;" onerror="this.style.display='none'">
          </div>
        </div>
        <div class="news-content">
          <div class="news-meta">
            <span class="news-date">${item.date}</span>
            <span class="news-category">${item.category}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
          <a href="news-template.html?id=${item.id}" class="read-more">阅读更多 <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');
        AOS.refresh();
    });