import { FC, memo, SVGProps } from 'react'
import styles from './avatar.module.css'
import { AvatarUIProps, IconType } from './type'
import EditIcon from '../../assets/avatar/avatar-edit.svg?react'
import AddIcon from '../../assets/avatar/avatar-add.svg?react'
import DefaultAvatarSvg  from '../../assets/avatar/avatar.svg?react'

const iconMap: Record<IconType, FC<SVGProps<SVGSVGElement>>> = {
  edit: EditIcon,
  add: AddIcon,
}

const AvatarUIComponent: FC<AvatarUIProps> = ({ image, name, size = 'md', iconType }) => {
  const IconComponent = iconType ? iconMap[iconType] : null

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      {image ? (
        <img className={styles.img} src={image} alt={name} />
      ) : (
        <DefaultAvatarSvg className={styles.img} />
      )}
      {IconComponent && (
        <span className={`${styles.icon} ${iconType ? styles[iconType] : ''}`}>
          <IconComponent />
        </span>
      )}
    </div>
  )
}

AvatarUIComponent.displayName = 'AvatarUI'

export const AvatarUI = memo(AvatarUIComponent)
