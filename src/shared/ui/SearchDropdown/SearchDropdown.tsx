import React from 'react';
import { SearchSuggestion } from '@/features/search/model/types';
import styles from './SearchDropdown.module.css';

interface SearchDropdownProps {
  results: SearchSuggestion[];
  onSelect: (result: SearchSuggestion) => void;
  isOpen: boolean;
}

// Вспомогательная функция для получения отображаемого имени
const getDisplayName = (item: SearchSuggestion): string => {
  if (item.type === 'skill') return item.title;
  return item.name;
};

// Получение текста типа на русском
const getTypeLabel = (type: SearchSuggestion['type']): string => {
  switch (type) {
    case 'category': return 'Категория';
    case 'subcategory': return 'Подкатегория';
    case 'skill': return 'Навык';
    default: return '';
  }
};

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ results, onSelect, isOpen }) => {
  if (!isOpen || results.length === 0) return null;

  return (
    <div className={styles.dropdown}>
      {results.map(item => (
        <div
          key={item.id}
          className={styles.item}
          onClick={() => onSelect(item)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className={styles.itemName}>{getDisplayName(item)}</span>
          <span className={styles.itemType}>{getTypeLabel(item.type)}</span>
        </div>
      ))}
    </div>
  );
};