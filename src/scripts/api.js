const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-42',
  headers: {
    authorization: 'aed7be04-ba7f-4bae-bfa4-bac0906abbb1',
    'Content-Type': 'application/json'
  }
};

const handleApiResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}

// Получение информации о пользователе
export const fetchUserProfile = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
  .then(handleApiResponse);
}

// Получение карточек с сервера
export const fetchCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
  .then(handleApiResponse);
}

// Обновление информации о пользователе
export const  updateProfileData = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  })
  .then(handleApiResponse);
}

// Добавление новой карточки
export const addNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link
    })
  })
  .then(handleApiResponse);
}

// Удаление карточки
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(handleApiResponse);
}

// Постановка лайка
export const addCardLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  })
  .then(handleApiResponse);
}

// Снятие лайка
export const removeCardLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(handleApiResponse);
}

// Обновление аватара
export const updateAvatar = (avatar) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatar
    })
  })
  .then(handleApiResponse);
}