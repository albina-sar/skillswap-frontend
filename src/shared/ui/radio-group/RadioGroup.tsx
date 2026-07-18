import { useState } from 'react';
import { RadioButton } from '../radio-button';
import { RadioGroupProps } from './type';
import styles from './RadioGroup.module.css'

export const RadioGroup = ({itemsList, groupName, title, isDisabled = false}: RadioGroupProps) => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <div className={styles.radioGroupItem}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <ul className={styles.list}>
        {itemsList.map((item) => (
          <li key={item.id}>
            <RadioButton
              name={groupName}
              value={item.name}
              label={item.name}
              isChecked={selectedValue === item.name}
              onChange={setSelectedValue}
              isDisabled={isDisabled}
            />
           </li> 
        ))}
      </ul>
    </div>
  );
};