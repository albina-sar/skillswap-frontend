import type { UserAccount } from '@/shared/types';
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants';

export function saveAccount(account: UserAccount): UserAccount {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ACCOUNT, JSON.stringify(account));
  return account
}

function readAccount(): UserAccount | null {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCOUNT);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserAccount;
  } catch {
    return null;
  };
}

export function getAccount(id: string): UserAccount | null {
  const account = readAccount();
  return account?.id === id ? account : null;
}

export function getProfile(id: string): Omit<UserAccount, 'password'> | null {
  const account = getAccount(id);
  if (!account) return null;
  // Профиль без пароля — единственное, что должно попадать в стор
  const { password, ...profile } = account;
  return profile
}

// Частичное обновление профиля, при этом пароль не сохраняется в стор
export function updateProfile(
  id: string,
  updates: Partial<Omit<UserAccount, 'id' | 'password'>>
): Omit<UserAccount, 'password'> | null {
  const account = getAccount(id);
  if (!account) return null;
  const updated = { ...account, ...updates };
  saveAccount(updated);
  const { password, ...profile } = updated;
  return profile
}

// Единственное место, где реально участвует пароль при входе
export function loginWithCredentials(
  email: string,
  password: string
): Omit<UserAccount, 'password'> {
  const account = readAccount();

  if (!account) {
    // Если в системе (этом браузере) вообще нет зарегистрированного аккаунта, намеренно, из соображений безопасности указываем такую ошибку. Чтобы не раскрывать пользователю, что именно пошло не так, и исключить возможность целенаправленного фишинга конкретного человека
    throw new Error('Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных');
  };

  if (account.email !== email || account.password !== password) {
    throw new Error('Email или пароль введены неверно');
  };

  const { password: _password, ...rest } = account;
  return rest
}

export function changePassword(id: string, currentPassword: string, newPassword: string): void {
  const account = getAccount(id);
  if (!account) {
    throw new Error('Аккаунт не найден');
  }
  if (account.password !== currentPassword) {
    throw new Error('Неверный текущий пароль');
  };
  saveAccount({ ...account, password: newPassword });
}