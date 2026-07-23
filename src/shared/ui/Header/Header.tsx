import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import { HeaderProps } from "./types";
import clsx from 'clsx';
import { ROUTES } from '@/shared/lib/constants';
import { useDebounce } from '@/shared/hooks/useDebounce';

import { Logo } from '../Logo'
import { Input } from "../Input";
import { ThemeToggle } from "../theme-toggle";
import { FavoriteButton } from "../favorite-button";
import { NotificationButton } from "../notification-button";
import { Button } from "../button/button";
import { ProfileUIComponent } from "../profile/profile";

export const Header = ({ isAuth, user, onSearch }: HeaderProps) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState<string>('');
    const [isSkillsOpen, setIsSkillsOpen] = useState<boolean>(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState<boolean>(false);
    const debouncedQuery = useDebounce(query, 500);

    const onQueryChange = (value: string) => {
        setQuery(value);
    }

    useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    const onSkillsClick = () => {
        setIsSkillsOpen((prev) => !prev);
    };

    const onBellClick = () => {
        setIsNotifyOpen((prev) => !prev)
    }

    return (
        <section className={styles.headerContainer}>
            <NavLink to={ROUTES.HOME} className={styles.logoLink}><Logo /></NavLink>
            <nav>
                <ul className={styles.navigation}>
                    <li><button className={styles.navButton}>О проекте</button></li>
                    <li><button className={styles.navButton} onClick={onSkillsClick}>
                        Все навыки
                        <img src='src/shared/assets/icons/ChevronDown.svg' alt='Стрелка вниз' width={24} height={24}/>
                        </button>
                    </li>
                </ul>
            </nav>
            <Input variant="search" value={query} onChange={onQueryChange} placeholder="Искать навык" name="search" showClear/>
            <div className={clsx(styles.authBar, isAuth ? styles.auth : styles.unAuth)}>
                <ThemeToggle isDark={false} onClick={() => {}} />
                {isAuth ? 
                    <div className={styles.authTrue}>
                        <div className={styles.quickActions}>
                            <NotificationButton hasNotifications={false} onClick={onBellClick} />
                            <FavoriteButton onClick={() => navigate(ROUTES.FAVORITES)} />
                        </div>
                        <ProfileUIComponent image={user.photo} name={user.name} />
                    </div>
                    :
                    <div className={styles.authFalse}>
                        <Button variant="outline" onClick={() => navigate(ROUTES.LOGIN)}>Войти</Button>
                        <Button onClick={() => navigate(ROUTES.REGISTER)}>Зарегистрироваться</Button>
                    </div>
                }
            </div>
            {/* Тут будет код для открытия выпадающего окна с перечнем навыков
            {isSkillsOpen && ...} */}

            {/* Тут будет код для открытия выпадающего окна с уведомлениями
            {isNotifyOpen && ...} */}
        </section>
    )
}