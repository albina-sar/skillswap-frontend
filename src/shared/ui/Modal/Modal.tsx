import React, { useRef, useEffect } from 'react';
import styles from './Modal.module.css'
import type { ModalProps } from './types'
import { Button } from '../button/button';

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        ref={modalRef}
        className={styles.modalContent}
      >
        {children}
        <Button onClick={onClose} variant="primary" size="large">
            Закрыть
        </Button>
      </div>
    </div>
  );
};

// Пример
// function ModalApp() {
//   const [isModalOpen, setModalOpen] = useState(false);

//   const openModal = () => setModalOpen(true);
//   const closeModal = () => setModalOpen(false);

//   return (
//     <div>
//       <Button onClick={openModal} variant="primary">Открыть модальное окно</Button>
      
//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         {/* любой контент внутри модалки */}
//         <h2>Это содержимое модалки</h2>
//         <p>Можно менять любое содержимое внутри компонента Modal.</p>
//       </Modal>
//     </div>
//   );
// }