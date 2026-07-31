import { Modal } from '../Modal/Modal';
import styles from './ModalSuccessSuggestion.module.css'
import doneIcon from '../../assets/icons/Done.svg';
import { Button } from '../button/button';

interface Props {
    isModalOpened: boolean;
    onCloseModal: () => void;
}

export function ModalSuccessSuggestion (props: Props) {
  return (
      <Modal isOpen={props.isModalOpened} onClose={props.onCloseModal}>
        <div className={styles.modalSucces}>
          <img src={doneIcon} alt="Иконка уведомления" className={styles.icon} />
          <div className={styles.textContent}>
            <h2 className={styles.title}>Ваше предложение создано</h2>
            <p className={styles.textParagraph}>Теперь вы можете предложить обмен</p>
          </div>
          <Button type="button" variant="primary" size="large" onClick={props.onCloseModal}>Готово</Button>
        </div>
      </Modal>
  );
};

// Пример использования
// export default function SuccessSuggestion() {
//   const [isModalOpened, setIsModalOpened] = useState(false);
//   return (
//     <main>
//       <ModalSuccessSuggestion isModalOpened={isModalOpened} onCloseModal={() => setIsModalOpened(false)}/>
//       <Button onClick={() => setIsModalOpened(true)}>Открыть модальное окно</Button>
//     </main>
//   )
// }