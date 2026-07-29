import { useLayoutEffect, useRef, useState } from 'react'

import type { Subcategory } from '@/shared/types'
import { Tag } from '@/shared/ui/Tag'

import styles from './OverflowTags.module.css'

interface OverflowTagsProps {
  skills: Subcategory[]
  enableOverflow?: boolean
  getBackgroundColor?: (subcategory: Subcategory) => string
}

export function OverflowTags({
  skills,
  enableOverflow = true,
  getBackgroundColor,
}: OverflowTagsProps) {
  const measureRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(skills.length)

  useLayoutEffect(() => {
    if (!enableOverflow) {
      setVisibleCount(skills.length)
      return
    }

    const container = measureRef.current

    if (!container) return

    const children = Array.from(container.children) as HTMLElement[]

    const tags = children.slice(0, skills.length)
    const overflow = children[skills.length]

    const width = container.clientWidth
    const gap = 8

    let count = skills.length

    for (let i = skills.length; i >= 0; i--) {
      const currentTags = tags.slice(0, i)

      const tagsWidth = currentTags.reduce((sum, tag) => sum + tag.offsetWidth, 0)

      const gaps = currentTags.length > 0 ? gap * (currentTags.length - 1) : 0

      const hidden = skills.length - i

      const overflowWidth = hidden > 0 ? gap + overflow.offsetWidth : 0

      if (tagsWidth + gaps + overflowWidth <= width) {
        count = i
        break
      }
    }

    setVisibleCount(count)
  }, [skills, enableOverflow])

  const visibleSkills = enableOverflow ? skills.slice(0, visibleCount) : skills

  const hiddenCount = skills.length - visibleCount

  return (
    <div className={styles.wrapper}>
      {enableOverflow && (
        <div ref={measureRef} className={styles.measure}>
          {skills.map((skill) => (
            <Tag
              key={skill.id}
              label={skill.name}
              backgroundColor={getBackgroundColor?.(skill) ?? 'var(--tag-new)'}
              textColor="var(--text-primary)"
            />
          ))}

          <Tag label="+99" backgroundColor="var(--tag-new)" textColor="var(--text-primary)" />
        </div>
      )}

      <div className={`${styles.tags} ${!enableOverflow ? styles.wrap : ''}`}>
        {visibleSkills.map((skill) => (
          <Tag
            key={skill.id}
            label={skill.name}
            backgroundColor={getBackgroundColor?.(skill) ?? 'var(--tag-new)'}
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
