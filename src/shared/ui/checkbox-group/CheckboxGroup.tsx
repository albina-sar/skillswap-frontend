import { useState } from 'react';
import clsx from 'clsx';
import { CheckboxGroupItem } from './CheckboxGroupItem';
import { CheckboxItem, CheckboxGroupProps } from './types';
import styles from './CheckboxGroup.module.css';

export const CheckboxGroup = ({
  itemsList,
  title,
  isDisabled = false,
  visibleCount,
  expandButtonText
}: CheckboxGroupProps) => {

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Добавить/убрать одно значение из selectedValues
  const toggleValue = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  // Клик по чекбоксу основного элемента (категории)
  const toggleItem = (item: CheckboxItem) => {
    if (!item.subcategories) {
      toggleValue(item.id);
      return;
    }
    const childIds = item.subcategories.map((s) => s.id);
    const allSelected = childIds.every((id) => selectedValues.includes(id));

    setSelectedValues((prev) =>
      allSelected
        ? prev.filter((v) => !childIds.includes(v))
        : [...new Set([...prev, ...childIds])]
    );
  };

  // Раскрыть/свернуть категорию
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const hasMore = visibleCount !== undefined && itemsList.length > visibleCount;
  const itemsToShow = hasMore && !showAll
    ? itemsList.slice(0, visibleCount)
    : itemsList;

  return (
    <div className={styles.checkboxGroupItem}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <ul className={styles.list}>
        {itemsToShow.map((item) => (
          <CheckboxGroupItem
            key={item.id}
            item={item}
            selectedValues={selectedValues}
            isExpanded={expandedIds.includes(item.id)}
            disabled={isDisabled}
            onToggleValue={toggleValue}
            onToggleItem={toggleItem}
            onToggleExpanded={toggleExpanded}
          />
        ))}
      </ul>

      {hasMore && (
        <button
          className={styles.showAllButton}
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? 'Скрыть' : `Все ${expandButtonText}`}
          <svg
            viewBox="0 0 24 24"
            className={clsx(styles.chevron, { [styles.chevronOpen]: showAll })}
          >
            <path fill="currentColor" d="M12 15.935c-.646 0-1.292-.249-1.781-.738L4.2 9.179a.696.696 0 0 1 0-.978.696.696 0 0 1 .978 0l6.018 6.018a1.136 1.136 0 0 0 1.606 0L18.821 8.2a.696.696 0 0 1 .978 0 .696.696 0 0 1 0 .978l-6.018 6.018c-.489.49-1.135.738-1.781.738"/>
          </svg>
        </button>
      )}
    </div>
  );
};