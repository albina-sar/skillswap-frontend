import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'
import type { NotFoundPageProps } from './types'
import { Button } from '@/shared/ui/button/button'

import error404Image from './error-img/404.png'
import error500Image from './error-img/500.png'

const getErrorContent = (code: number) => {
  const category = Math.floor(code / 100)
  if (category === 4) {
    return {
      title: 'Страница не найдена',
      description:
        'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже',
      image: error404Image,
    }
  }
  if (category === 5) {
    return {
      title: 'На сервере произошла ошибка',
      description: 'Попробуйте позже или вернитесь на главную страницу',
      image: error500Image,
    }
  }
  return {
    title: 'Произошла ошибка',
    description: 'Попробуйте обновить страницу или вернитесь позже',
    image: error500Image,
  }
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ errorCode }) => {
  const navigate = useNavigate()
  const code = Number(errorCode)
  const content = getErrorContent(code)

  const handleReportError = () => {
    console.log('Сообщить об ошибке') // кнопку сказано не реализовывать. заглушка
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.illustration}>
            <img src={content.image} alt={`Ошибка ${code}`} className={styles.errorImage} />
          </div>

          <h2 className={styles.title}>{content.title}</h2>
          <p className={styles.description}>{content.description}</p>

          <div className={styles.actions}>
            <Button variant="outline" onClick={handleReportError}>
              Сообщить об ошибке
            </Button>
            <Button variant="primary" onClick={() => navigate('/')}>
              На главную
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage
