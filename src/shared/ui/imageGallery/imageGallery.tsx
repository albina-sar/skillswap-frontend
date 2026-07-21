import { FC, memo, useRef, useState, useCallback, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import type { Swiper as SwiperType } from 'swiper'
import type { MyGalleryProps } from './type'
import styles from './imageGallery.module.css'

const MAX_VISIBLE_THUMBS = 3

const ImageGalleryUIComponent: FC<MyGalleryProps> = ({ images = [] }) => {
  const swiperRef = useRef<SwiperType | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setCurrentIndex(swiper.realIndex)
  }, [])

  const visibleThumbs = useMemo(() => {
  const total = images.length

  // нужно для того, что бы было зацикливание, берём первые 3 индекса от currnet
  const thumbIndices: number[] = []
  for (let i = 1; i <= MAX_VISIBLE_THUMBS; i++) {
    const idx = (currentIndex + i) % total
    if (!thumbIndices.includes(idx)) {
      thumbIndices.push(idx)
    }
  }

  return thumbIndices.map((idx, i) => ({
    url: images[idx],
    index: idx,
    isLast: i === thumbIndices.length - 1,
    count: total - thumbIndices.length - 1,
  }))
}, [images, currentIndex])

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainSlide}>
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1}
          loop={true}
          onSwiper={(swiper) => { swiperRef.current = swiper }}
          onSlideChange={handleSlideChange}
        >
          {images.map((url, i) => (
            <SwiperSlide key={i}>
              <img className={styles.slideImg} src={url} alt={`Slide ${i + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.thumbnails}>
        {visibleThumbs.map((thumb) => (
          <button
            key={thumb.index}
            className={`${styles.thumbBtn} ${
              thumb.index === currentIndex ? styles.thumbActive : ''
            }`}
            onClick={() => swiperRef.current?.slideToLoop(thumb.index)}
          >
            <img
              className={styles.thumbImg}
              src={thumb.url}
              alt={`Thumbnail ${thumb.index + 1}`}
            />
            {thumb.isLast && thumb.count > 1 && (
              <div className={styles.thumbOverlay}>
                <span className={styles.overlayCount}>+{thumb.count - 1}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

ImageGalleryUIComponent.displayName = 'ImageGalleryUI'

export const ImageGalleryUI = memo(ImageGalleryUIComponent)


// зацикленное листание картинок, как использовать:
// для этого необходимо передать массив картинок в компонент:
// const images = [
//   "https://picsum.photos/id/237/536/354",
//   "https://picsum.photos/seed/picsum/536/354",
//   "https://picsum.photos/id/1084/536/354",
//   "https://picsum.photos/id/1060/536/354",
//   "https://picsum.photos/id/870/536/354",
//   "https://picsum.photos/id/1084/536/354",
//   "https://picsum.photos/id/1060/536/354",
//   "https://picsum.photos/id/870/536/354",
//   "https://picsum.photos/seed/picsum/536/354"
// ];
// если что картинки повторяются, у меня просто не грузился unplush, который мы используем для фото в профиле, потому вставила эти

// затем вызвать сам компонент

// <ImageGalleryUI images={images}/>

// Для того, что бы компонент был адаптивным я не ограничивала его по ширине и высоте, для того, что бы он отобразился как на макете его нужно ограничить.
// пример реализации как на макете:
// <div style={{height: 444, width:573, paddingTop:80, paddingRight:52, paddingBottom:40, paddingLeft:77, backgroundColor: "#fff"}}>
//   <ImageGalleryUI images={images}/>
// </div>
