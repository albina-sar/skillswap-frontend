// ─── Skill ───────────────────────────────────────────────
export interface Skill {
  id: string
  title: string
  description: string
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
  skills: string[]
  wantsToLearn: string[]
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

// ─── Account ─────────────────────────────────────────────
export interface UserAccount extends User {
  email: string
  password: string
}

// ─── City ────────────────────────────────────────────────
export type City = {
  id: string
  name: string
}
//─── Category ─────────────────────────────────────────────

export interface Subcategory {
  id: string
  name: string
}

export type CategoryIcon = 'business' | 'art' | 'languages' | 'education' | 'home' | 'health'

export interface Category {
  id: string
  name: string
  icon: CategoryIcon
  subcategories: Subcategory[]
}
