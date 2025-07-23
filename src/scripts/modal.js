// Открываем попап с анимацией
export function openModal(modalElement) {
  // Закрываем все другие попапы перед открытием нового
  document.querySelectorAll('.popup_is-opened').forEach(popup => {
    popup.classList.remove('popup_is-opened', 'popup_is-animated'); // сбрасываем состояние анимации
  });
  // устанавливаем начальное состояние для анимации
  modalElement.classList.add('popup_is-animated');
   // requestAnimationFrame дает браузеру время применить начальные стили перед анимацией
  requestAnimationFrame(() => {
    modalElement.classList.add('popup_is-opened');
  });
  document.addEventListener('keydown', handleEscape);
  modalElement.addEventListener('click', handleOverlayClick);
}

// Закрываем попап 
export function closeModal(modalElement) {
  modalElement.classList.remove('popup_is-opened');
  // таймер для заверешения анимации закрытия
  setTimeout(() => {
    modalElement.classList.remove('popup_is-animated');
  }, 600);
  
  document.removeEventListener('keydown', handleEscape);
  modalElement.removeEventListener('click', handleOverlayClick);
}

// Обработчик закрытия попапа с помощью Escape
function handleEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) closeModal(openedPopup);
  }
}

// Обработчик нажатия по оверлею
export function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) closeModal(evt.currentTarget);
}

export function confirmModal() {
  const confirmModal = document.querySelector('.popup_type_confirm');
  const confirmButton = confirmModal.querySelector('.popup__button-confirm');

  return (callback) => {
    const handleConfirm = () => {
      callback();
      closeModal(confirmModal);
      confirmButton.removeEventListener('click', handleConfirm);
    };

    confirmButton.addEventListener('click', handleConfirm);
    openModal(confirmModal);

    return () => {
      confirmButton.removeEventListener('click', handleConfirm);
    };
  };
}