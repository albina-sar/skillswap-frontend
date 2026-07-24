import { forwardRef } from 'react';
import styles from './Calendar.module.css';

interface CustomInputProps {
    id?: string;
    value?: string;
    onClick?: () => void;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ id, value, onClick, onChange, placeholder }, ref) => (
        <div className={styles.inputWrapper}>
            <input
                ref={ref}
                id={id}
                className={styles.calendarInput}
                value={value}
                onChange={onChange}
                onClick={onClick}
                placeholder={placeholder}
            />
            <svg
                className={styles.calendarIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
            </svg>
        </div>
    )
);

CustomInput.displayName = 'CalendarInput';
