// ─── Skill ───────────────────────────────────────────────
export type SkillType = 'teach' | 'learn'

export interface Skill {
  id: string
  title: string
  description: string
  type: SkillType
  categoryId: string
  subcategoryId: string
  tags: string[]
  imageUrl: string[]
  authorId: string
  createdAt: string
  likesCount: number
}

// ─── User ────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  city: string
  gender: string
  dateOfBirth: string
  photo: string
  about: string
  skills: string[];
  wantsToLearn: string[];
}

// ─── Request ─────────────────────────────────────────────
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done'

export interface SwapRequest {
  id: string
  skillId: string
  fromUserId: string
  toUserId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

// ─── Auth ────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}

// ─── City ────────────────────────────────────────────────
export type City = {
  id: string
  name: string
}
//─── Category ─────────────────────────────────────────────

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];

}
