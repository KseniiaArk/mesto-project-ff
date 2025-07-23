// Отображает сообщение об ошибке
function showValidationMessage(formContainer, inputField, errorText, formValidationSettings) {
  const errorMessageContainer = formContainer.querySelector(`.${inputField.id}-error`); 
  
  inputField.classList.add(formValidationSettings.inputErrorClass);

  errorMessageContainer.textContent = errorText; // делаем видимым текст ошибки
  errorMessageContainer.classList.add(formValidationSettings.errorClass);
}

// Скрывает сообщение об ошибке
function hideValidationMessage(formContainer, inputField, formValidationSettings) {
  const errorMessageContainer = formContainer.querySelector(`.${inputField.id}-error`);

  inputField.classList.remove(formValidationSettings.inputErrorClass);

  errorMessageContainer.classList.remove(formValidationSettings.errorClass);
  errorMessageContainer.textContent = '';
}

// Проверяет валидность поля и показывает/скрывает ошибку
function checkFieldValidity(formContainer, inputField, formValidationSettings) {
  if (inputField.validity.patternMismatch && inputField.dataset.errorMessage) {
    inputField.setCustomValidity(inputField.dataset.errorMessage);
  } else {
    inputField.setCustomValidity("");
  }

  if (!inputField.validity.valid) {
    showValidationMessage(formContainer, inputField, inputField.validationMessage, formValidationSettings);
  } else {
    hideValidationMessage(formContainer, inputField, formValidationSettings);
  }
}

// Переключает состояние кнопки отправки формы
function refreshSubmitButton(inputFields, submitButton, formValidationSettings) {
  const invalidFieldExists = inputFields.some(field => !field.validity.valid);
  
  submitButton.disabled = invalidFieldExists;
  submitButton.classList.toggle(formValidationSettings.inactiveButtonClass, invalidFieldExists);
}

// Обработчик событий для валидации
function configureFormValidation(formContainer, formValidationSettings) {
  const formFields = Array.from(formContainer.querySelectorAll(formValidationSettings.inputSelector));
  const formSubmitButton = formContainer.querySelector(formValidationSettings.submitButtonSelector);
  
  refreshSubmitButton(formFields, formSubmitButton, formValidationSettings); // инициализация состоянния кнопки
  
  formFields.forEach(field => {
    field.addEventListener('input', () => {
      checkFieldValidity(formContainer, field, formValidationSettings);
      refreshSubmitButton(formFields, formSubmitButton, formValidationSettings);
    });
  });
}

// Инициализируем валидацию для форм
export function enableValidation(formValidationSettings) {
  const allForms = Array.from(document.querySelectorAll(formValidationSettings.formSelector));
  
  allForms.forEach(form => {
    configureFormValidation(form, formValidationSettings);
    
    form.addEventListener('submit', (submitEvent) => { //отменим стандарстную отправку
      submitEvent.preventDefault();
    });
  });
}

// Сброс валидации формы
export function clearValidation(formContainer, formValidationSettings) {
  const formFields = Array.from(formContainer.querySelectorAll(formValidationSettings.inputSelector));
  const formSubmitButton = formContainer.querySelector(formValidationSettings.submitButtonSelector);

  formFields.forEach(field => {
    hideValidationMessage(formContainer, field, formValidationSettings);
    field.setCustomValidity(''); // сбросить стандартные сообщения ошибок
  });
  
  formSubmitButton.disabled = true;
  formSubmitButton.classList.add(formValidationSettings.inactiveButtonClass);// заблокировать кнопку отправки
}