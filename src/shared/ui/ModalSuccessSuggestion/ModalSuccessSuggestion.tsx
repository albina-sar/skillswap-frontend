import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import styles from './ModalSuccessSuggestion.module.css'
import doneIcon from '../../assets/icons/Done.png';
import { Button } from '../button/button';

export function ModalSuccessSuggestion () {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  return (
    <div>
      <Button onClick={openModal} variant="primary">Открыть модальное окно</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <img src={doneIcon} alt="Иконка уведомления" />
        <div className={styles.textContent}>
          <h2 className={styles.title}>Важе предложение создано</h2>
          <p className={styles.textParagraph}>Теперь вы можете предложить обмен</p>
        </div>
        <Button variant="primary" size="large" onClick={closeModal}>Готово</Button>
      </Modal>
    </div>
  );
};