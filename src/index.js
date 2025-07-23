import './pages/index.css';
import { fetchUserProfile, fetchCards, updateProfileData, addNewCard, deleteCard, removeCardLike, addCardLike, updateAvatar } from './scripts/api.js';
import { createCard } from './scripts/card.js'; 
import { openModal, closeModal, handleOverlayClick, confirmModal } from './scripts/modal.js'; 
import { enableValidation, clearValidation } from './scripts/validation.js';

const profileTitle = document.querySelector('.profile__title'); // заголовок профиля
const profileDescription = document.querySelector('.profile__description'); // описание профиля

const editButton = document.querySelector('.profile__edit-button'); // кнопка редактирования профиля
const addButton = document.querySelector('.profile__add-button'); // кнопка добавления карточки

// Попапы 
const popupEdit = document.querySelector('.popup_type_edit'); // редактирование профиля
const popupNewCard = document.querySelector('.popup_type_new-card'); // добавление карточки
const popupImage = document.querySelector('.popup_type_image'); // просмотр изображения

// Формы
const formEdit = document.forms['edit-profile']; // редактирование профиля
const formNewCard = document.forms['new-place']; // добавление карточки 
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

// Функция для формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault(); 

  const submitButton = formEdit.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  updateProfileData(nameInput.value,jobInput.value)
    .then(userData => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(popupEdit);
    })
    .catch(err => console.error(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// Функция для формы добавления карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); 
  
  const submitButton = formNewCard.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

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
      submitButton.textContent = originalText;
    })
}

const confirmDelete = confirmModal();
function handleDeleteCard(cardElement, cardId) {
  confirmDelete(() => {
    deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch(err => console.error(err));
  });
}

function handleLikeCard(likeButton, cardId, likeCountElement) {
  const currentLiked = likeButton.classList.contains('card__like-button_is-active');
  let apiProcess;
  if (currentLiked) {
    apiProcess = removeCardLike;
  } else apiProcess = addCardLike;

  apiProcess(cardId) 
    .then(cardData => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCountElement.textContent = cardData.likes.length;
    })
    .catch(err => {
      console.error('Ошибка:', err);
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = formAvatar.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

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
      submitButton.textContent = originalText;
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

loadInitialData();