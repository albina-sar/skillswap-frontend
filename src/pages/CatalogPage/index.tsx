// TODO: реализовать страницу CatalogPage
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsersThunk } from '../../store/usersSlice';

export default function CatalogPage() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  return (
    <main>
      <h1>CatalogPage</h1>
      <p>Страница в разработке</p>
      <div>
        <h2>Список пользователей</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}