import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import styles from './ModalExchangeSuggestion.module.css'
import notificationIcon from '../../assets/icons/notification.svg';
import { Button } from '../button/button';

export function ModalExchangeSuggestion() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  return (
    <div>
      <Button onClick={openModal} variant="primary">Открыть модальное окно</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <img src={notificationIcon} alt="Иконка уведомления" />
        <div className={styles.textContent}>
          <h2 className={styles.title}>Вы предложили обмен</h2>
          <p className={styles.textParagraph}>Теперь дождитесь подтверждения. Вам придёт уведомление</p>
        </div>
        <Button variant="primary" size="large" onClick={closeModal}>Готово</Button>
      </Modal>
    </div>
  );
};