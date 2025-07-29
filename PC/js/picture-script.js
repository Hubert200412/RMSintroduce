// 初始化收银系统轮播图
const posSwiper = new Swiper(".pos-swiper", {
  slidesPerView: 5,
  spaceBetween: 0,
  centeredSlides: true,
  loop: true,
  simulateTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  navigation: {
    nextEl: ".pos-swiper .swiper-button-next",
    prevEl: ".pos-swiper .swiper-button-prev",
  },
})

// 初始化收银配件轮播图
const accessoriesSwiper = new Swiper(".accessories-swiper", {
  slidesPerView: 5,
  spaceBetween: 0,
  centeredSlides: true,
  loop: true,
  simulateTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  navigation: {
    nextEl: ".accessories-swiper .swiper-button-next",
    prevEl: ".accessories-swiper .swiper-button-prev",
  },
})

const calculateHeight = () => {
  const swiperSlideElements = Array.from(document.querySelectorAll('.swiper .swiper-slide'))
  if (!swiperSlideElements.length) return
  const width = swiperSlideElements[0].getBoundingClientRect().width
  const height = Math.round(width / (16 / 9))
  swiperSlideElements.map(element => element.style.height = `${height}px`)
}

document.addEventListener("DOMContentLoaded", calculateHeight)
addEventListener('resize', calculateHeight)