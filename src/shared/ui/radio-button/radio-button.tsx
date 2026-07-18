import styles from './radio-button.module.css';
import { radioButtonProps } from './types';
import clsx from 'clsx';

export const RadioButton = ({
  label,
  isChecked,
  onChange,
}: radioButtonProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className={styles.item}>
      <input
        type="radio"
        value={label}
        checked={isChecked}
        onChange={handleChange}
        aria-label={label}
        className={styles.visuallyHidden}
      />
      <span className={styles.radioButtonContainer}>
        <svg
            fill="none"
            viewBox="0 0 24 24"
            className={styles.icon}
        >
            <path
              fill="#000"
              d="M12 22C6.484 22 2 17.516 2 12S6.484 2 12 2s10 4.484 10 10-4.484 10-10 10m0-18.605c-4.744 0-8.605 3.86-8.605 8.605 0 4.744 3.86 8.605 8.605 8.605 4.744 0 8.605-3.86 8.605-8.605 0-4.744-3.86-8.605-8.605-8.605"
            />
        </svg>
        <svg
            fill="none"
            viewBox="0 0 24 24"
            className={clsx(styles.icon, {[styles.hidden]: !isChecked})}
        >
            <path 
              fill="currentColor"
              d="M12 22C6.484 22 2 17.516 2 12S6.484 2 12 2s10 4.484 10 10-4.484 10-10 10m0-18.605c-4.744 0-8.605 3.86-8.605 8.605 0 4.744 3.86 8.605 8.605 8.605 4.744 0 8.605-3.86 8.605-8.605 0-4.744-3.86-8.605-8.605-8.605"
            />
            <circle cx="12" cy="12" r="5" fill="currentColor"/>
        </svg>
       </span> 
      <span className={styles.labelText}>{label}</span>
    </label>
  );
};