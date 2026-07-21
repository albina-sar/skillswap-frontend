import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react'
import type { ImageUploadProps } from './types'
import { Icon } from './Icon'
import styles from './ImageUpload.module.css'

export const ImageUpload = ({
  onChange,
  accept = 'image/*',
  className = '',
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const selectFile = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    onChange(file)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0])

    // Позволяет повторно выбрать тот же файл.
    event.target.value = ''
  }

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepth.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepth.current -= 1
    if (dragDepth.current <= 0) {
      dragDepth.current = 0
      setIsDragging(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepth.current = 0
    setIsDragging(false)

    selectFile(event.dataTransfer.files[0])
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    inputRef.current?.click()
  }

  const classes = [
    styles.upload,
    isDragging && styles.dragging,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      role="button"
      aria-label="Загрузить изображение навыка"
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        className={styles.input}
        type="file"
        accept={accept}
        onChange={handleInputChange}
      />

      <span className={styles.prompt}>
        {isDragging ? 'Отпустите изображение здесь' : 'Перетащите или выберите изображения навыка'}
      </span>

      <span className={styles.action}>
        <Icon className={styles.icon} />
        <span>{isDragging ? 'Загрузить изображение' : 'Выбрать изображения'}</span>
      </span>
    </div>
  )
}
