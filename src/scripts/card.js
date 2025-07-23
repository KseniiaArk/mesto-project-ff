// Функция создания карточек
export function createCard(cardData, onDeleteClick, onLikeClick, onImageClick, userId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link; 
  cardImage.alt = cardData.name; 
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;
  
  // удаление только своих карточек
  if (!isOwner(cardData.owner._id, userId)) {
    deleteButton.remove();
  }

  // есть ли наш лайк
  if (checkIfUserLiked(cardData.likes, userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  deleteButton.addEventListener('click', () => onDeleteClick(cardElement, cardData._id));
  likeButton.addEventListener('click', () => onLikeClick(likeButton, cardData._id, likeCount));
  cardImage.addEventListener('click', () => onImageClick(cardData));

  return cardElement; 
}

function isOwner(cardOwnerId, currentUserId) {
  return cardOwnerId === currentUserId;
}

function checkIfUserLiked(likes, userId) {
  return likes.some(like => like._id === userId);
}
