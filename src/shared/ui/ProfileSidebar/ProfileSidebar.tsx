import React, { useState } from 'react'
import styles from './ProfileSidebar.module.css'
import requestIcon from '../../assets/icons-sidebar-profile/request.svg';
import messageTextIcon from '../../assets/icons-sidebar-profile/message-text.svg';
import likeIcon from '../../assets/icons-sidebar-profile/like.svg';
import ideaIcon from '../../assets/icons-sidebar-profile/idea.svg';
import userIcon from '../../assets/icons-sidebar-profile/user.svg';

const sections = [
  { id: 'request', label: 'Заявки', icon: requestIcon},
  { id: 'exchanges', label: 'Мои обмены', icon: messageTextIcon},
  { id: 'favorites', label: 'Избранное', icon: likeIcon},
  { id: 'skills', label: 'Мои навыки', icon: ideaIcon},
  { id: 'profile', label: 'Личные данные', icon: userIcon},
];

export const ProfileSidebar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');

  const handleClick = (id: string) => {
    setActiveSection(id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {sections.map(section => (
          <div
            key={section.id}
            className={`${styles.item} ${
              activeSection === section.id ? styles.active : ''
            }`}
            onClick={() => handleClick(section.id)}
          >
            <img src={section.icon} alt="иконка" />
            <div>{section.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
