import { RadioButton } from '../radio-button';
import { RadioGroupProps } from './type';
import styles from './RadioGroup.module.css'

export const RadioGroup = ({itemsList, groupName, title, isDisabled = false, selectedValue, onChange}: RadioGroupProps) => {

  return (
    <div className={styles.radioGroupItem}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <ul className={styles.list}>
        {itemsList.map((item) => (
          <li key={item.id}>
            <RadioButton
              name={groupName}
              value={item.id}
              label={item.name}
              isChecked={selectedValue === item.id}
              onChange={onChange}
              isDisabled={isDisabled}
            />
           </li> 
        ))}
      </ul>
    </div>
  );
};