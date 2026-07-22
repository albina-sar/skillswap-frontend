import {  useState } from 'react';
import DataPicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import { offset } from '@floating-ui/dom';
import "react-datepicker/dist/react-datepicker.css";
import styles from './Calendar.module.css';

import { Button } from '../button/button';
import { CustomHeader } from './CustomHeader';
import { CustomInput } from './CustomInput';

import { CalendarProps } from './types';

registerLocale("ru", ru);
setDefaultLocale("ru");

export const Calendar = ({ onSubmit }: CalendarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [visibleDate, setVisibleDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    
    const handleChange = (date: Date | null) => {
        setVisibleDate(date);
    };

    const handleCancel = () => {
        setVisibleDate(selectedDate);
        setIsOpen(false);
    };

    const handleApply = () => {
        if (visibleDate) {
            setSelectedDate(visibleDate)
            onSubmit(visibleDate);
            setIsOpen(false);
        }
    };

    return (
        <DataPicker
            open={isOpen}
            onInputClick={() => setIsOpen(true)}
            dateFormat="dd.MM.yyyy"
            selected={visibleDate}
            onChange={handleChange}
            shouldCloseOnSelect={false}
            placeholderText='дд.мм.гггг'
            renderCustomHeader={CustomHeader}
            showPopperArrow={false}
            popperPlacement="bottom-start"
            customInput={<CustomInput />}
            popperModifiers={[offset(4)]}
            className={styles.calendarInput}
            calendarClassName={styles.calendar}
            weekDayClassName={() => styles.weekday}
            dayClassName={(date) => date.getMonth() !== currentMonth ? styles.outsideMonthDay : styles.day}
            filterDate={(date) => date.getMonth() === currentMonth}
            onMonthChange={(date) => setCurrentMonth(date.getMonth())}
            disabledKeyboardNavigation
        >
            <div className={styles.buttonList}>
                <Button variant='outline'size='short' onClick={handleCancel}>
                    Отменить
                </Button>
                <Button variant='primary' size='short' onClick={handleApply}>
                    Выбрать
                </Button>
            </div>
        </ DataPicker>
    )
}