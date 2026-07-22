import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react'
import type { ImageUploadProps } from './types'
import { Icon } from './Icon'
import styles from './ImageUpload.module.css'

const MAX_FILES = 7

interface SelectedImage {
  file: File
  previewUrl: string
}

export const ImageUpload = ({
  onChange,
  accept = 'image/*',
  className = '',
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const selectedImagesRef = useRef<SelectedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const isLimitReached = selectedImages.length >= MAX_FILES

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl))
    }
  }, [])

  const selectFiles = (fileList: FileList | null) => {
    if (!fileList || selectedImagesRef.current.length >= MAX_FILES) return

    const availableSlots = MAX_FILES - selectedImagesRef.current.length
    const images = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, availableSlots)

    const newImages = images.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    selectedImagesRef.current = [...selectedImagesRef.current, ...newImages]
    setSelectedImages(selectedImagesRef.current)
    onChange(selectedImagesRef.current.map(({ file }) => file))
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFiles(event.target.files)

    // Позволяет повторно выбрать тот же файл.
    event.target.value = ''
  }

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (isLimitReached) return

    dragDepth.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (isLimitReached) {
      event.dataTransfer.dropEffect = 'none'
      return
    }

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

    selectFiles(event.dataTransfer.files)
  }

  const removeImage = (previewUrl: string) => {
    const imageToRemove = selectedImagesRef.current.find(
      (image) => image.previewUrl === previewUrl,
    )
    if (!imageToRemove) return

    URL.revokeObjectURL(imageToRemove.previewUrl)
    selectedImagesRef.current = selectedImagesRef.current.filter(
      (image) => image.previewUrl !== previewUrl,
    )
    setSelectedImages(selectedImagesRef.current)
    onChange(selectedImagesRef.current.map(({ file }) => file))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isLimitReached || (event.key !== 'Enter' && event.key !== ' ')) return

    event.preventDefault()
    inputRef.current?.click()
  }

  const classes = [
    styles.upload,
    isDragging && styles.dragging,
    isLimitReached && styles.limitReached,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.container}>
      <div
        className={classes}
        role="button"
        aria-label="Загрузить изображение навыка"
        onClick={() => !isLimitReached && inputRef.current?.click()}
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
          multiple
          disabled={isLimitReached}
          onChange={handleInputChange}
        />

        <span className={styles.prompt}>
          {isDragging ? 'Отпустите изображения здесь' : 'Перетащите или выберите изображения навыка'}
        </span>

        <span className={styles.action}>
          <Icon className={styles.icon} />
          <span>
            {isLimitReached
              ? 'Достигнут лимит изображений'
              : isDragging
                ? 'Загрузить изображения'
                : 'Выбрать изображения'}
          </span>
        </span>

        {selectedImages.length > 0 && (
          <div className={styles.selected}>
            <p className={styles.count}>Загружено: {selectedImages.length} из {MAX_FILES}</p>
            <ul className={styles.previews} aria-label="Загруженные изображения">
              {selectedImages.map(({ file, previewUrl }) => (
                <li className={styles.preview} key={previewUrl}>
                  <img src={previewUrl} alt={file.name} />
                  <button
                    className={styles.removeButton}
                    type="button"
                    aria-label={`Удалить изображение ${file.name}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      removeImage(previewUrl)
                    }}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
