import {  useEffect, useState } from 'react';
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

export const Calendar = ({ id, value = null, onSubmit }: CalendarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(value);
    const [visibleDate, setVisibleDate] = useState<Date | null>(value);
    const [currentMonth, setCurrentMonth] = useState((value ?? new Date()).getMonth());

    useEffect(() => {
        setSelectedDate(value);
        setVisibleDate(value);
        if (value) setCurrentMonth(value.getMonth());
    }, [value]);
    
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
            id={id}
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
