import { AvatarUI } from '@/shared/ui/avatar/avatar'
import { FC } from 'react'
import { AvatarUIProps } from '@/shared/ui/avatar/type'

export const Avatar: FC<AvatarUIProps> = ({ image, name, iconType, size }) => {

  return <AvatarUI image={image ? image : undefined} name={name} size={size} iconType={iconType ? iconType : undefined} />
}
