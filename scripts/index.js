// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const cardTemplate = document.querySelector('#card-template').content;
const cardList = document.querySelector('.places__list');

function createCard(cardData, cardDelete) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    deleteButton.addEventListener('click', () => cardDelete(cardElement));

    return cardElement;
}

function handleDelete(cardElement) {
    cardElement.remove();
}

function drawCards(cardsArray, container) {
  cardsArray.forEach(cardData => {
    const cardElement = createCard(cardData, handleDelete);
    container.append(cardElement);
  });
}

drawCards(initialCards, cardList);
