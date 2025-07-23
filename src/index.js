import './pages/index.css';
import { fetchUserProfile, fetchCards, updateProfileData, addNewCard, deleteCard, removeCardLike, addCardLike, updateAvatar } from './scripts/api.js';
import { createCard, handleLikeCard } from './scripts/card.js'; 
import { openModal, closeModal, handleOverlayClick} from './scripts/modal.js'; 
import { enableValidation, clearValidation } from './scripts/validation.js';

const profileTitle = document.querySelector('.profile__title'); // заголовок профиля
const profileDescription = document.querySelector('.profile__description'); // описание профиля

const editButton = document.querySelector('.profile__edit-button'); // кнопка редактирования профиля
const addButton = document.querySelector('.profile__add-button'); // кнопка добавления карточки

// Попапы 
const popupEdit = document.querySelector('.popup_type_edit'); // редактирование профиля
const popupNewCard = document.querySelector('.popup_type_new-card'); // добавление карточки
const popupImage = document.querySelector('.popup_type_image'); // просмотр изображения
const popupConfirm = document.querySelector('.popup_type_confirm');

// Формы
const formEdit = document.forms['edit-profile']; // редактирование профиля
const formNewCard = document.forms['new-place']; // добавление карточки 
const formConfirm = document.forms['confirm-deletion'];
const nameInput = formEdit.querySelector('.popup__input_type_name'); // поле ввода имени
const jobInput = formEdit.querySelector('.popup__input_type_description'); // поле ввода описания
const placeNameInput = formNewCard.querySelector('.popup__input_type_card-name'); // поле ввода названия места
const linkInput = formNewCard.querySelector('.popup__input_type_url'); // поле ввода ссылки на картинку

const popupImageElement = popupImage.querySelector('.popup__image'); // картинка в попапе
const popupCaption = popupImage.querySelector('.popup__caption'); // описание к картинке

const cardList = document.querySelector('.places__list'); // Список карточек

// Обновление аватарки
const profileAvatar = document.querySelector('.profile__image'); 
const popupAvatar = document.querySelector('.popup_type_update-avatar'); 
const formAvatar = document.forms['update-avatar']; 
const avatarInput = formAvatar.querySelector('.popup__input_type_url-avatar'); 

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

let userId;

enableValidation(validationConfig);

function handleCardClick(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  
  openModal(popupImage);
}

function loadInitialData() {
  Promise.all([fetchUserProfile(), fetchCards()])
    .then(([userData, cards]) => {
      userId = userData._id;

      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;

      renderCards(cards, userId)
    })
    .catch(err => console.error(err));
}

function renderCards(cards, currentUserId) {
  cards.forEach(card => {
    const cardElement = createCard (
      card,
      handleDeleteCard,
      handleLikeCard,
      handleCardClick,
      currentUserId
    );
    cardList.append(cardElement);
  });
}

function renderLoading(button, isLoading, loadingText = 'Сохранение...', defaultText = 'Сохранить') {
  if (isLoading) {
    button.disabled = true;
  } else {
    button.disabled = false;
  }

  let currentButtonText;
  if (isLoading) {
    currentButtonText = loadingText; 
  } else {
    currentButtonText = defaultText; 
  }
  button.textContent = currentButtonText;
}

// Функция для формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault(); 
  const submitButton = formEdit.querySelector('.popup__button');
  
  renderLoading(submitButton, true, 'Сохранение...', 'Сохранить');

  updateProfileData(nameInput.value,jobInput.value)
    .then(userData => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(popupEdit);
    })
    .catch(err => console.error(err))
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

// Функция для формы добавления карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); 
  const submitButton = formNewCard.querySelector('.popup__button');
  
  renderLoading(submitButton, true, 'Сохранение...', 'Сохранить');

  addNewCard(placeNameInput.value, linkInput.value)
    .then(cardData => {
      const cardElement = createCard(
        cardData,
        handleDeleteCard,
        handleLikeCard,
        handleCardClick,
        userId
      );
      cardList.prepend(cardElement);
      formNewCard.reset();
      closeModal(popupNewCard);
    })
    .catch(err => console.error(err))
    .finally(() => {
      renderLoading(submitButton, false);
    })
}

// const confirmDelete = confirmModal();
let cardToDelete = null;
function handleDeleteCard(cardElement, cardId) {
  cardToDelete = {
    element: cardElement,
    id: cardId
  }
  openModal(popupConfirm);
  /*confirmDelete(() => {
    deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch(err => console.error(err));
  });*/
}

function handleConfirmFormSubmit(evt) {
  evt.preventDefault();

  if (!cardToDelete) return;

  const submitButton = formConfirm.querySelector('.popup__button-confirm');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Удаление...';

  deleteCard(cardToDelete.id) 
    .then(() => {
      cardToDelete.element.remove();
      closeModal(popupConfirm);
      cardToDelete = null;
    })
    .catch(err => console.error(err))
    .finally(() =>{
      submitButton.textContent = originalText;
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = formAvatar.querySelector('.popup__button');
  
  renderLoading(submitButton, true, 'Сохранение...', 'Сохранить');

  updateAvatar(avatarInput.value)
    .then(userData => {
      if (userData && userData.avatar) {  
        profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
        closeModal(popupAvatar);
        formAvatar.reset();
      }
    })
    .catch(err => console.error(err))
    .finally(() => {
      renderLoading(submitButton, false);
    })
}

// Открытие попапа редактирования профиля
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEdit,validationConfig);
  
  openModal(popupEdit);
});

// Открытие попапа добавления карточки
addButton.addEventListener('click', () => {
  formNewCard.reset();
  clearValidation(formNewCard,validationConfig);
  openModal(popupNewCard)});


// Настройка обработчиков закрытия для всех попапов
document.querySelectorAll('.popup').forEach(popup => {
  // закрытие по крестику
  const closeButton = popup.querySelector('.popup__close');
  if (closeButton) {
    closeButton.addEventListener('click', () => closeModal(popup));
  }
  
  // закрытие по клику на оверлей
  popup.addEventListener('click', handleOverlayClick);
});

profileAvatar.addEventListener('click', () => {
  formAvatar.reset();
  clearValidation(formAvatar,validationConfig);
  openModal(popupAvatar);
});

// Обработчики отправки форм
formEdit.addEventListener('submit', handleEditFormSubmit);
formNewCard.addEventListener('submit', handleAddCardFormSubmit);
formAvatar.addEventListener('submit', handleAvatarFormSubmit);
formConfirm.addEventListener('submit', handleConfirmFormSubmit)

loadInitialData();