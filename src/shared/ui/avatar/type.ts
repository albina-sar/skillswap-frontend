export type Avatarsize = 'xs' | 'sm' | 'md' | 'lg';
export type IconType = 'edit' | 'add';

export type AvatarUIProps = {
  image?: string;
  name: string;
  iconType?: IconType;
  size: Avatarsize;
}
