import { FC, memo, useState } from 'react';

import { Avatar } from '@/components/avatar-element';

import { UserMenu } from './UserMenu';
import { ProfileUIProps } from './types';
import styles from './profile.module.css';

export const ProfileUIComponent: FC<ProfileUIProps> = ({
  image,
  name,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.container}
        onClick={handleClick}
        type="button"
      >
        <span className={styles.text}>{name}</span>

        <Avatar
          image={image}
          name={name}
          size="xs"
        />
      </button>

      {isMenuOpen && <UserMenu />}
    </div>
  );
};

ProfileUIComponent.displayName = 'ProfileUI';

export const ProfileUI = memo(ProfileUIComponent);
