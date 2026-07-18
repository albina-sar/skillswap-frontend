import React from 'react'
import styles from './ProfileSidebar.module.css'
import requestIcon from '../../assets/icons-sidebar-profile/request.svg';
import messageTextIcon from '../../assets/icons-sidebar-profile/message-text.svg';
import likeIcon from '../../assets/icons-sidebar-profile/like.svg';
import ideaIcon from '../../assets/icons-sidebar-profile/idea.svg';
import userIcon from '../../assets/icons-sidebar-profile/user.svg';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";


const sections = [
  { id: 'request', label: 'Заявки', icon: requestIcon, path: '/request'},
  { id: 'exchanges', label: 'Мои обмены', icon: messageTextIcon, path: '/exchanges'},
  { id: 'favorites', label: 'Избранное', icon: likeIcon, path: '/favorites'},
  { id: 'skills', label: 'Мои навыки', icon: ideaIcon, path: '/skills'},
  { id: 'profile', label: 'Личные данные', icon: userIcon, path: '/profile'},
];

export const ProfileSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {sections.map(section => (
          <nav>
            <Link
              to={section.path}
              key={section.id}
              className={`${styles.item} ${
                location.pathname === section.path ? styles.active : ''
              }`}
            >
              <img src={section.icon} alt={section.id} />
              <div>{section.label}</div>
            </Link>
          </nav>
        ))}
      </div>
    </div>
  );
};
