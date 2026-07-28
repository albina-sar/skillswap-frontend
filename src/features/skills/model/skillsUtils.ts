import type { Skill } from '@/shared/types';
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants';
import { generateId } from '@/shared/lib/helpers';

export function getCreatedSkills(): Skill[] {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.CREATED_SKILLS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Skill[];
  } catch {
    return [];
  };
}

export function saveCreatedSkill(skill: Omit<Skill, 'id' | 'createdAt' | 'likesCount'>): Skill {
  const newSkill: Skill = {
    ...skill,
    id: generateId(),
    createdAt: new Date().toISOString(),
    likesCount: 0,
  };
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.CREATED_SKILLS,
    JSON.stringify([...getCreatedSkills(), newSkill])
  );
  return newSkill
}