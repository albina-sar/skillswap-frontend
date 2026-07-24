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
    <div>
      <Modal isOpen={props.isModalOpened} onClose={props.onCloseModal}>
        <img src={doneIcon} alt="Иконка уведомления" />
        <div className={styles.textContent}>
          <h2 className={styles.title}>Ваше предложение создано</h2>
          <p className={styles.textParagraph}>Теперь вы можете предложить обмен</p>
        </div>
        <Button variant="primary" size="large" onClick={props.onCloseModal}>Готово</Button>
      </Modal>
    </div>
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