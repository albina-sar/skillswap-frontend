import { Modal } from '../Modal/Modal';
import styles from './ModalExchangeSuggestion.module.css'
import notificationIcon from '../../assets/icons/notification.svg';
import { Button } from '../button/button';

interface Props {
  isModalOpened: boolean;
  onCloseModal: () => void;
}

export function ModalExchangeSuggestion(props: Props) {
  return (
      <Modal isOpen={props.isModalOpened} onClose={props.onCloseModal}>
        <div className={styles.exchangeModal}>
          <img src={notificationIcon} alt="Иконка уведомления" className={styles.icon} />
          <div className={styles.textContent}>
            <h2 className={styles.title}>Вы предложили обмен</h2>
            <p className={styles.textParagraph}>Теперь дождитесь подтверждения. Вам придёт уведомление</p>
          </div>
          <Button variant="primary" size="large" onClick={props.onCloseModal}>Готово</Button>
        </div>
      </Modal>
  );
};

// Пример использования
// export default function ExchangeSuggestion() {
//     const [isModalOpened, setIsModalOpened] = useState(false);
//   return (
//     <main>
//        <ModalExchangeSuggestion isModalOpened={isModalOpened} onCloseModal={() => setIsModalOpened(false)}/>
//       <Button onClick={() => setIsModalOpened(true)}>Открыть</Button>
//     </main>
//   )
// }