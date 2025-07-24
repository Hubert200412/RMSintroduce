// 初始化AOS动画
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

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
    window.addEventListener('DOMContentLoaded', function() {
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
            canvas.width = window.innerWidth-200;
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
                        // 黑灰色主色调，冷色更深
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
        }
        const particle = new Particle();
        particle.init();
        function step() {
            ctx.fillStyle = "rgba(255,140,0,1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            particle.draw();
            particle.update();
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    });
}
