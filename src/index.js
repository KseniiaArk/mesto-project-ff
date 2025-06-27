import './pages/index.css';
import { initialCards } from './scripts/cards.js'; 
import { createCard, handleDeleteCard, handleLikeCard } from './scripts/card.js'; 
import { openModal, closeModal, handleOverlayClick } from './scripts/modal.js'; 

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


function handleCardClick(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  
  openModal(popupImage);
}

// Функция отрисовки массива initialCard
// для каждой карточки в массиве создаем элемент карточки
// и добавляем карточку в контейнер
function drawInitialCards() {
  initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, handleDeleteCard, handleLikeCard, handleCardClick);
    cardList.append(cardElement);
  });
}

// Функция для формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault(); 
  
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  
  closeModal(popupEdit);
}

// Функция для формы добавления карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); 
  const newCard = {               // создаем объект с данными новой карточки
    name: placeNameInput.value, 
    link: linkInput.value       
  };
  const cardElement = createCard(newCard, handleDeleteCard, handleLikeCard, handleCardClick); // создаем элемент карточки
  cardList.prepend(cardElement);   // добавляем новую карточку в начало списка
  formNewCard.reset();  // сбрасываем значения формы
  
  closeModal(popupNewCard);
}

// Открытие попапа редактирования профиля
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  
  openModal(popupEdit);
});

// Открытие попапа добавления карточки
addButton.addEventListener('click', () => openModal(popupNewCard));

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

// Обработчики отправки форм
formEdit.addEventListener('submit', handleEditFormSubmit);
formNewCard.addEventListener('submit', handleAddCardFormSubmit);

drawInitialCards();