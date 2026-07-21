import { useLayoutEffect, useRef, useState } from 'react'

import type { Skill } from '@/shared/types'
import { Tag } from '@/shared/ui/Tag'

import styles from './OverflowTags.module.css'

interface OverflowTagsProps {
  skills: Skill[]
  getBackgroundColor?: (skill: Skill) => string
}

export function OverflowTags({ skills, getBackgroundColor }: OverflowTagsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(skills.length)

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) return

    const items = Array.from(container.children) as HTMLElement[]

    const containerWidth = container.clientWidth
    const gap = 8

    let usedWidth = 0
    let count = 0

    const hiddenTagWidth = 45 // примерная ширина +N

    for (const item of items) {
      const itemWidth = item.offsetWidth

      const nextWidth = usedWidth + itemWidth + (count > 0 ? gap : 0)

      const needHiddenTag = skills.length - (count + 1) > 0

      const totalWidth = needHiddenTag ? nextWidth + gap + hiddenTagWidth : nextWidth

      if (totalWidth > containerWidth) {
        break
      }

      usedWidth = nextWidth
      count++
    }

    setVisibleCount(Math.max(count, 1))
  }, [skills])

  const hiddenCount = skills.length - visibleCount

  return (
    <div className={styles.tagsWrapper}>
      <div ref={containerRef} className={styles.measure} aria-hidden="true">
        {skills.map((skill) => (
          <Tag
            key={skill.id}
            label={skill.title}
            backgroundColor={getBackgroundColor ? getBackgroundColor(skill) : 'var(--tag-new)'}
            textColor="var(--text-primary)"
          />
        ))}
      </div>

      <div className={styles.tags}>
        {skills.slice(0, visibleCount).map((skill) => (
          <Tag
            key={skill.id}
            label={skill.title}
            backgroundColor={getBackgroundColor ? getBackgroundColor(skill) : 'var(--tag-new)'}
            textColor="var(--text-primary)"
          />
        ))}

        {hiddenCount > 0 && (
          <Tag
            label={`+${hiddenCount}`}
            backgroundColor="var(--tag-new)"
            textColor="var(--text-primary)"
          />
        )}
      </div>
    </div>
  )
}
