import styles from './radio-button.module.css';
import { radioButtonProps } from './types';
import clsx from 'clsx';

export const RadioButton = ({
  name,
  value,
  label,
  isChecked,
  isDisabled = false,
  onChange,
}: radioButtonProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className={styles.item}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        aria-label={label}
        className={styles.visuallyHidden}
        disabled={isDisabled}
      />
      <span className={styles.radioButtonContainer}>
        <svg
            fill="none"
            viewBox="0 0 24 24"
            className={styles.icon}
        >
            <path
              fill="currentColor"
              d="M12 22C6.484 22 2 17.516 2 12S6.484 2 12 2s10 4.484 10 10-4.484 10-10 10m0-18.605c-4.744 0-8.605 3.86-8.605 8.605 0 4.744 3.86 8.605 8.605 8.605 4.744 0 8.605-3.86 8.605-8.605 0-4.744-3.86-8.605-8.605-8.605"
              className={clsx({[styles.checked]: isChecked})}
            />
            <circle 
              cx="12"
              cy="12"
              r="5"
              fill="currentColor"
              className={clsx({[styles.hidden]: !isChecked, [styles.checked]: isChecked})}/>
        </svg>
       </span> 
      <span className={styles.labelText}>{label}</span>
    </label>
  );
};