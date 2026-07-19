import { CheckboxItem } from "@/shared/ui/checkbox-group/types";
import { CATEGORIES_DATA, MOCK_CITIES } from '../../../shared/lib/constants';

export type FilterValue = string | string[];

export type FiltersState = Record<string, FilterValue>;

export type FilterGroupConfig =
  |{
      id: string;
      type: 'radio';
      title?: string;
      defaultValue: string;
      options: { id: string; name: string }[];
    } | {
      id: string;
      type: 'checkbox';
      title?: string;
      visibleCount?: number;
      options: CheckboxItem[];
      expandButtonText: string;
    };

export const filterGroups: FilterGroupConfig[] = [
  {
    id: 'learningType',
    type: 'radio',
    defaultValue: 'any',
    options: [
      { id: 'any', name: 'Всё' },
      { id: 'learn', name: 'Хочу научиться' },
      { id: 'teach', name: 'Могу научить' },
    ],
  },
  {
    id: 'skills',
    type: 'checkbox',
    title: 'Навыки',
    visibleCount: 5,
    options: CATEGORIES_DATA,
    expandButtonText: 'категории'
  },
  {
    id: 'gender',
    type: 'radio',
    title: 'Пол автора',
    defaultValue: 'any',
    options: [
      { id: 'any', name: 'Не имеет значения' },
      { id: 'male', name: 'Мужской' },
      { id: 'female', name: 'Женский' },
    ],
  },
  {
    id: 'city',
    type: 'checkbox',
    title: 'Город',
    visibleCount: 5,
    options: MOCK_CITIES,
    expandButtonText: 'города'
  },
];

export const getDefaultFilterValues = (groups: FilterGroupConfig[]): FiltersState =>
  Object.fromEntries(
    groups.map((group): [string, FilterValue] => [
      group.id,
      group.type === 'radio' ? group.defaultValue : [],
    ])
  );