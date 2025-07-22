// 优势展示动画 - 基于GSAP
// 复刻example\动态展示内容的效果

// 注册GSAP插件
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  
  // 创建自定义缓动函数
  CustomEase.create("customEase", "0.6, 0.01, 0.05, 1");
  CustomEase.create("blurEase", "0.25, 0.1, 0.25, 1");
  CustomEase.create("counterEase", "0.35, 0.0, 0.15, 1");
  CustomEase.create("gentleIn", "0.38, 0.005, 0.215, 1");
}

let advantageMainTl;

// 初始化优势动画
function initAdvantageAnimation() {
  if (!document.querySelector('.advantages-dynamic')) return;
  
  if (advantageMainTl) advantageMainTl.kill();

  // 确保重新开始按钮初始隐藏
  gsap.set(".advantages-restart-btn", { opacity: 0, pointerEvents: "none" });
  gsap.set(".advantages-big-title", { opacity: 0 });
  gsap.set(".advantage-title-line span", { y: "100%", opacity: 0 });

  const percentages = [0, 25, 50, 75, 99];
  const wrappers = [
    document.getElementById("advantage-image-0"),
    document.getElementById("advantage-image-25"),
    document.getElementById("advantage-image-50"),
    document.getElementById("advantage-image-75"),
    document.getElementById("advantage-image-100")
  ];

  const percentageElement = document.querySelector(".advantages-percentage");
  const imageContainer = document.querySelector(".advantages-image-container");
  const finalWrapper = document.getElementById("advantage-image-100");

  if (!wrappers[0] || !percentageElement || !imageContainer) return;

  // 重置包装器和容器尺寸
  gsap.set(wrappers, { visibility: "hidden", clipPath: "inset(100% 0 0 0)" });
  gsap.set(wrappers[0], { visibility: "visible" });
  gsap.set(imageContainer, { width: "1000px", height: "600px" });
  gsap.set(".advantage-image-wrapper img", {
    scale: 1.2,
    transformOrigin: "center center"
  });

  // 设置预加载器覆盖层
  gsap.set(".advantages-preloader", { display: "flex", opacity: 1 });

  advantageMainTl = gsap.timeline();

  // 动画文字行进入
  advantageMainTl.to(
    ".advantage-text-line",
    {
      opacity: 1,
      duration: 0.15,
      stagger: 0.075,
      ease: "gentleIn"
    },
    0.5
  );

  // 改变文字行颜色
  advantageMainTl.to(
    ".advantage-text-line",
    {
      color: "#fff",
      duration: 0.15,
      stagger: 0.075,
      ease: "blurEase"
    },
    "+=0.5"
  );

  // 图片和文字说明同步动画
  const advantageTexts = [
    "完善的自媒体运营体系",
    "独到的成本管理系统",
    "全新的智能化技术",
    "多方位的数据分析能力", 
    "适配的技术支持"
  ];
  
  percentages.forEach((percentage, index) => {
    const windowWidth = window.innerWidth;
    const textWidth = advantageTexts[index].length * 24; // 估算文字宽度
    const padding = 32;
    const maxMoveDistance = 200; // 限制最大移动距离
    let leftPosition;
    
    if (percentage === 0) {
      leftPosition = padding + "px";
    } else if (percentage === 99) {
      leftPosition = Math.min(padding + maxMoveDistance, windowWidth - textWidth - padding) + "px";
    } else {
      const moveDistance = (maxMoveDistance * percentage) / 100;
      leftPosition = padding + moveDistance + "px";
    }

    // 为这一步创建同步标签
    advantageMainTl.add(`step${percentage}`, index * 1.5);

    // 设置图片包装器可见
    advantageMainTl.set(wrappers[index], { visibility: "visible" }, `step${percentage}`);

    // 同时动画图片显示和文字说明变化
    advantageMainTl.to(
      wrappers[index],
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.65,
        ease: "customEase"
      },
      `step${percentage}`
    );

    // 同步文字说明更新与图片显示
    advantageMainTl.to(
      percentageElement,
      {
        innerText: advantageTexts[index],
        left: leftPosition,
        duration: 0.65,
        ease: "counterEase",
        onStart: function () {
          gsap.fromTo(
            percentageElement,
            { filter: "blur(8px)" },
            { filter: "blur(0px)", duration: 0.5, ease: "power2.inOut" }
          );
        }
      },
      `step${percentage}`
    );

    // 在当前图片显示后隐藏前一张图片
    if (index > 0) {
      advantageMainTl.to(
        wrappers[index - 1],
        {
          clipPath: "inset(100% 0 0 0)",
          duration: 0.5,
          ease: "customEase",
          onComplete: function () {
            gsap.set(wrappers[index - 1], { visibility: "hidden" });
          }
        },
        `step${percentage}+=0.15`
      );
    }
  });

  // 在最终阶段前动画文字行消失
  advantageMainTl.to(
    ".advantage-text-line",
    {
      opacity: 0,
      duration: 0.15,
      stagger: 0.075,
      ease: "counterEase"
    },
    "step99+=1"
  );

  // 最终阶段：扩展最终图片
  advantageMainTl.add("expandFinal", ">");
  advantageMainTl.to({}, { duration: 0.5 }, "expandFinal");

  // 扩展图片容器到全屏
  advantageMainTl.to(
    imageContainer,
    {
      width: "100vw",
      height: "100vh",
      duration: 1.2,
      ease: "gentleIn"
    },
    "expandFinal+=0.5"
  );

  // 缩放最终图片
  if (finalWrapper) {
    const finalImage = finalWrapper.querySelector("img");
    if (finalImage) {
      advantageMainTl.to(
        finalImage,
        {
          scale: 1.0,
          duration: 1.2,
          ease: "gentleIn"
        },
        "expandFinal+=0.5"
      );
    }
  }

  // 淡出文字说明
  advantageMainTl.to(
    percentageElement,
    {
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.5,
      ease: "power2.out"
    },
    "expandFinal+=0.8"
  );

  // 显示大标题
  advantageMainTl.to(
    ".advantages-big-title",
    {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    },
    "expandFinal+=1.2"
  );

  // 动画大标题文字
  advantageMainTl.to(
    ".advantage-title-line span",
    {
      y: "0%",
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    },
    "expandFinal+=1.5"
  );

  // 显示重新开始按钮
  advantageMainTl.to(
    ".advantages-restart-btn",
    {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.5,
      ease: "power2.out"
    },
    "expandFinal+=2.5"
  );
}

// 重新开始动画
function restartAdvantageAnimation() {
  // 重置文字说明元素的状态
  const percentageElement = document.querySelector(".advantages-percentage");
  if (percentageElement) {
    gsap.set(percentageElement, { 
      opacity: 1, 
      filter: "blur(0px)",
      left: "2rem",
      innerText: "自媒体运营"
    });
  }
  
  // 重置其他元素状态
  gsap.set(".advantages-big-title", { opacity: 0 });
  gsap.set(".advantage-title-line span", { y: "100%", opacity: 0 });
  gsap.set(".advantages-restart-btn", { opacity: 0, pointerEvents: "none" });
  
  // 重新初始化动画
  initAdvantageAnimation();
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
  // 确保GSAP加载后再初始化
  if (typeof gsap !== 'undefined') {
    initAdvantageAnimation();
  } else {
    // 如果GSAP未加载，等待一段时间后重试
    setTimeout(() => {
      if (typeof gsap !== 'undefined') {
        initAdvantageAnimation();
      }
    }, 1000);
  }
});

// 绑定重新开始按钮事件
document.addEventListener('click', function(e) {
  if (e.target.closest('.advantages-restart-btn')) {
    restartAdvantageAnimation();
  }
});

// 窗口大小改变时重新初始化
window.addEventListener('resize', function() {
  if (advantageMainTl) {
    setTimeout(() => {
      initAdvantageAnimation();
    }, 300);
  }
});

// 使用Intersection Observer在元素进入视口时启动动画
if (typeof IntersectionObserver !== 'undefined') {
  const advantageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.classList.contains('advantages-section')) {
          // 延迟启动动画，确保元素完全进入视口
          setTimeout(() => {
            if (typeof gsap !== 'undefined') {
              initAdvantageAnimation();
            }
          }, 500);
          advantageObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    }
  );

  // 观察优势部分
  document.addEventListener('DOMContentLoaded', function() {
    const advantageSection = document.querySelector('.advantages-section');
    if (advantageSection) {
      advantageObserver.observe(advantageSection);
    }
  });
}
