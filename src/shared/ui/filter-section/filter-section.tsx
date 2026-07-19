import { useState } from 'react';
import { RadioGroup } from '@/shared/ui/radio-group';
import { CheckboxGroup } from '@/shared/ui/checkbox-group';
import { Card } from '../Card';
import { getDefaultFilterValues,  FilterValue } from '@/features/filters/model/filterGroups';
import { FilterSectionProps } from './types';
import styles from './filter-section.module.css';

export const FilterSection = ({ groups }: FilterSectionProps) => {
  const [values, setValues] = useState(() => getDefaultFilterValues(groups));

  const activeCount = groups.reduce((count, group) => {
    const value = values[group.id];
    if (group.type === 'radio') {
      return count + (value !== group.defaultValue ? 1 : 0);
    }
    return count + (Array.isArray(value) ? value.length : 0);
  }, 0);

  const handleChange = (id: string, value: FilterValue) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    setValues(getDefaultFilterValues(groups));
  };

  return (
    <Card className={styles.card}>
        <div className={styles.header}>
        <h2 className={styles.title}>Фильтры {activeCount > 0 && `(${activeCount})`}</h2>
        {activeCount > 0 && (
            <button onClick={handleReset} className={styles.resetButton}>
            Сбросить
            <svg viewBox="0 0 24 24" className={styles.resetIcon}>
                <path fill="currentColor" d="m16.744 8.288-8.486 8.485c-.29.29-.77.29-1.06 0a.755.755 0 0 1 0-1.06l8.485-8.486c.29-.29.77-.29 1.06 0s.29.77 0 1.06"/>
                <path fill="currentColor" d="M16.744 16.773c-.29.29-.771.29-1.06 0L7.197 8.288a.755.755 0 0 1 0-1.061c.29-.29.77-.29 1.06 0l8.486 8.485c.29.29.29.77 0 1.06"/>
            </svg>
            </button>
        )}
        </div>
        <div className={styles.section}>
        {groups.map((group) => {
        if (group.type === 'radio') {
            return (
            <RadioGroup
                key={group.id}
                groupName={group.id}
                title={group.title}
                itemsList={group.options}
                selectedValue={values[group.id] as string}
                onChange={(value) => handleChange(group.id, value)}
            />
            );
        }

        return (
            <CheckboxGroup
            key={group.id}
            title={group.title}
            itemsList={group.options}
            visibleCount={group.visibleCount}
            selectedValues={(values[group.id] as string[]) ?? []}
            onChange={(next) => handleChange(group.id, next)}
            expandButtonText={group.expandButtonText}
            />
        );
        })}
      </div>
    </Card>
  );
};