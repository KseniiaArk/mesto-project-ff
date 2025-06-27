// Функция создания карточек
export function createCard(cardData, deleteCallback, likeCallback, openImageCallback) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link; 
  cardImage.alt = cardData.name; 
  cardTitle.textContent = cardData.name; 

  deleteButton.addEventListener('click', () => deleteCallback(cardElement));
  likeButton.addEventListener('click', likeCallback);
  cardImage.addEventListener('click', () => openImageCallback(cardData));

  return cardElement; 
}

// Функция удаления элмента из DOM
export function handleDeleteCard(cardElement) {
  cardElement.remove(); 
}

// Функция переключения класса активности для лайка
export function handleLikeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}