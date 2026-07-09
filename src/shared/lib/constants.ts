export const ROUTES = {
  HOME: '/',
  SKILL: '/skill/:id',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  CREATE: '/create',
  LOGIN: '/login',
  REGISTER: '/register',
} as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'skillswap_auth_user',
  FAVORITES: 'skillswap_favorites',
  REQUESTS: 'skillswap_requests',
  THEME: 'skillswap_theme',
} as const

export interface Category {
  id: number;
  name: string;
  subcategories: string[];
}

export const CATEGORIES_DATA: Category[] = [
  {
    id: 1,
    name: "Бизнес и карьера",
    subcategories: [
      "Управление командой",
      "Маркетинг и реклама",
      "Продажи и переговоры",
      "Личный бренд",
      "Резюме и собеседование",
      "Тайм-менеджмент",
      "Проектное управление",
      "Предпринимательство"
    ]
  },
  {
    id: 2,
    name: "Творчество и искусство",
    subcategories: [
      "Рисование и иллюстрация",
      "Фотография",
      "Видеомонтаж",
      "Музыка и звук",
      "Актёрское мастерство",
      "Креативное письмо",
      "Арт-терапия",
      "Декор и DIY"
    ]
  },
  {
    id: 3,
    name: "Иностранные языки",
    subcategories: [
      "Английский",
      "Французский",
      "Испанский",
      "Немецкий",
      "Китайский",
      "Японский",
      "Подготовка к экзаменам (IELTS, TOEFL)"
    ]
  },
  {
    id: 4,
    name: "Образование и развитие",
    subcategories: [
      "Личностное развитие",
      "Навыки обучения",
      "Когнитивные техники",
      "Скорочтение",
      "Навыки преподавания",
      "Коучинг"
    ]
  },
  {
    id: 5,
    name: "Дом и уют",
    subcategories: [
      "Уборка и организация",
      "Домашние финансы",
      "Приготовление еды",
      "Домашние растения",
      "Ремонт",
      "Хранение вещей"
    ]
  },
  {
    id: 6,
    name: "Здоровье и лайфстайл",
    subcategories: [
      "Йога и медитация",
      "Питание и ЗОЖ",
      "Ментальное здоровье",
      "Осознанность",
      "Физические тренировки",
      "Сон и восстановление",
      "Баланс жизни и работы"
    ]
  }
];
