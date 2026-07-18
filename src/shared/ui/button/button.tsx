import React from 'react';
import clsx from 'clsx';
import styles from './button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'outline_form' | 'reset_filter' | 'white';
  image?: React.ReactNode;
  imagePosition?: 'left' | 'right';
  size?: 'short' | 'large';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  image,
  imagePosition = 'right',
  size = 'short',
  onClick,
  ...props
}) => {
  // Выносим логику рендеринга иконки для чистоты JSX
  const renderImage = () => (
    <div className={styles.image}>
      {typeof image === 'string' ? (
        <img src={image} alt="" aria-hidden="true" />
      ) : (
        image
      )}
    </div>
  );
  return (
    <button
      onClick={onClick}
      className={clsx(
        styles.base,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {image && imagePosition === 'left' && renderImage()}
      {children}
      {image && imagePosition === 'right' && renderImage()}
    </button>
  );
};
