import type {ReactDatePickerCustomHeaderProps} from 'react-datepicker'
import {getYear, getMonth} from 'date-fns';
import styles from './Calendar.module.css'

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

const range = (start: number, end: number, step: number) => Array.from({ length: (end - start) / step }, (_, i) => start + i * step);
const years = range(1990, getYear(new Date()) + 1, 1) as number[];

export const CustomHeader = ({date, changeYear, changeMonth }: ReactDatePickerCustomHeaderProps) => (
  <div className={styles.header}>
    <select
      value={MONTHS[getMonth(date)]}
      onChange={({ target: { value } }) =>
        changeMonth(MONTHS.indexOf(value as (typeof MONTHS)[number]))
      }
      className={styles.select}
    >
      {MONTHS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    
    <select
      value={getYear(date)}
      onChange={({ target: { value } }) => changeYear(+value)}
      className={styles.select}
    >
      {years.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);