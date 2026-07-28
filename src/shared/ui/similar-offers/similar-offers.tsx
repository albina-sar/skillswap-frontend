import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Heading } from '../Heading'
import styles from './similar-offers.module.css'
import { UserCardElement } from '@/components/usercard-element/usercard-elemetn'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import clsx from 'clsx'

interface SimilarOffersUIProps {
  users: string[]
}

const CARD_WIDTH = 324

export const SimilarOffersUI: FC<SimilarOffersUIProps> = ({ users }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gap, setGap] = useState(24)

  const recalcGap = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const containerW = el.offsetWidth
    const cardsPerView = Math.max(1, Math.floor(containerW / CARD_WIDTH))
    const occupied = cardsPerView * CARD_WIDTH
    const free = containerW - occupied
    const gapsCount = cardsPerView - 1
    setGap(gapsCount > 0 ? free / gapsCount : 0)
  }, [])

  useEffect(() => {
    recalcGap()
    const observer = new ResizeObserver(recalcGap)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [recalcGap])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <>
      {users.length === 0 ? (
        <div className={styles.empty}>Нет похожих предложений</div>
      ) : (
        <div className={styles.sliderWrapper}>
          <button
            className={clsx(styles.btnArrow, styles.btnPrev, !canScrollPrev && styles.btnDisabled)}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Предыдущий слайд"
          >
            <svg width="5" height="10" viewBox="0 0 8 14" fill="none" xmlns="http://w3.org">
              <path
                d="M7 13L1 7L7 1"
                stroke="#69735D"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={styles.embla} ref={emblaRef}>
            <div className={styles.emblaContainer} ref={containerRef}>
              {users.map((userId, index) => (
                <div
                  key={userId}
                  className={styles.emblaSlide}
                  style={{ paddingRight: index === users.length - 1 ? 0 : `${gap}px` }}
                >
                  <div className={styles.slideCard}>
                    <UserCardElement authorid={userId} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={clsx(styles.btnArrow, styles.btnNext, !canScrollNext && styles.btnDisabled)}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Следующий слайд"
          >
            <svg width="5" height="10" viewBox="0 0 8 14" fill="none" xmlns="http://w3.org">
              <path
                d="M1 13L7 7L1 1"
                stroke="#69735D"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
