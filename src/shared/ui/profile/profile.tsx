import { ProfileUIProps } from "./types";
import styles from './profile.module.css'
import { Avatar } from "@/components/avatar-element";
import { FC, memo } from "react";

export const ProfileUIComponent: FC<ProfileUIProps> = ({image, name}) => {

  const handleClick = () => {
    console.log('заглушка для отображения popup menu');
  }
  return(
    <div className={styles.container} onClick={handleClick}>
      <span className={styles.text}>{name}</span>
      <Avatar image={image} name={name} size='xs' />
    </div>
  )
}

ProfileUIComponent.displayName = 'ProfileUI';

export const ProfileUI = memo(ProfileUIComponent)
