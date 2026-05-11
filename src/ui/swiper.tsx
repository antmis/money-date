import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'

export interface PageSwiperHandle {
  slideNext: () => void
  slidePrev: () => void
  slideTo: (index: number) => void
}

interface PageSwiperProps {
  slides: React.ReactNode[]
  onSlideChange: (index: number) => void
}

export const PageSwiper = forwardRef<PageSwiperHandle, PageSwiperProps>(
  ({ slides, onSlideChange }, ref) => {
    const swiperRef = useRef<SwiperType | null>(null)

    useImperativeHandle(ref, () => ({
      slideNext: () => swiperRef.current?.slideNext(),
      slidePrev: () => swiperRef.current?.slidePrev(),
      slideTo: (index) => swiperRef.current?.slideTo(index),
    }))

    return (
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <Swiper
          slidesPerView={1}
          style={{ width: '100%' }}
          onSwiper={(swiper) => { swiperRef.current = swiper }}
          onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)}
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i} style={{ width: '100%', boxSizing: 'border-box' }}>
              {slide}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }
)
