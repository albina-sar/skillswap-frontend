import clsx from 'clsx';
import { Checkbox } from '../checkbox';
import { CheckboxGroupItemProps } from './types';
import styles from './CheckboxGroup.module.css';

export const CheckboxGroupItem = ({
  item,
  selectedValues,
  isExpanded,
  disabled,
  onToggleValue,
  onToggleItem,
  onToggleExpanded,
}: CheckboxGroupItemProps) => {
  const hasChildren = !!item.subcategories?.length;
  const childIds = item.subcategories?.map((s) => s.id) ?? [];
  const selectedChildCount = childIds.filter((id) => selectedValues.includes(id)).length;

  const isAllSelected = hasChildren && selectedChildCount === childIds.length;
  const isPartiallySelected = hasChildren && selectedChildCount > 0 && !isAllSelected;

  const isChecked = hasChildren
    ? isAllSelected || isPartiallySelected
    : selectedValues.includes(item.id);

  const icon = isPartiallySelected ? 'minus' : 'check';

  return (
    <li className={styles.item}>
      <div className={styles.mainItem}>
        <Checkbox
          icon={icon}
          value={item.id}
          label={item.name}
          isChecked={isChecked}
          isDisabled={disabled}
          onChange={() => onToggleItem(item)}
        />
        {hasChildren && (
          <button
            onClick={() => onToggleExpanded(item.id)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
          >
            <svg
              viewBox="0 0 24 24"
              className={clsx(styles.chevron, { [styles.chevronOpen]: isExpanded })}
            >
              <path fill="currentColor" d="M12 15.935c-.646 0-1.292-.249-1.781-.738L4.2 9.179a.696.696 0 0 1 0-.978.696.696 0 0 1 .978 0l6.018 6.018a1.136 1.136 0 0 0 1.606 0L18.821 8.2a.696.696 0 0 1 .978 0 .696.696 0 0 1 0 .978l-6.018 6.018c-.489.49-1.135.738-1.781.738"/>
            </svg>
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul className={clsx(styles.list, styles.sublist)}>
          {item.subcategories!.map((sub) => (
            <li key={sub.id} className={styles.sublistItem}>
              <Checkbox
                icon="check"
                value={sub.id}
                label={sub.name}
                isChecked={selectedValues.includes(sub.id)}
                isDisabled={disabled}
                onChange={() => onToggleValue(sub.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};