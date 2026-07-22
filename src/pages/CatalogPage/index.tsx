// TODO: реализовать страницу CatalogPage
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadSkills,
  selectSkills,
  selectSkillsError,
  selectSkillsLoading,
} from '@/entities/skill/model/skillsSlice'

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const skills = useAppSelector(selectSkills)
  const loading = useAppSelector(selectSkillsLoading)
  const error = useAppSelector(selectSkillsError)

  useEffect(() => {
    dispatch(loadSkills())
  }, [dispatch])

  return (
    <main>
      <h1>CatalogPage</h1>
      <p>Страница в разработке</p>
      
      <b>Временный вывод данных для проверки skillsSlice:</b>
      {loading && <p>Загрузка навыков…</p>}
      {error && <p>Ошибка: {error}</p>}
      <ul>
        {skills.map((skill) => (
          <li key={skill.id}>
            title: {skill.title} / likesCount: {skill.likesCount}
          </li>
        ))}
      </ul>
    </main>
  )
}
