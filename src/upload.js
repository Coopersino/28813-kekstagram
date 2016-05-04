/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

var browserCookies = require('browser-cookies');
var utilities = require('./utilities');

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2,
    SIZE_INVALID: 3
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }
  /**
   * Зафиксируем минимальные значения полей в форме на уровне 0 (не дадим задавать отрицательные значения).
   */
  utilities.fieldLeft.min = 0;
  utilities.fieldTop.min = 0;
  utilities.side.min = 1;

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    /**
     * Сумма значений полей «слева» и «сторона» не должна быть больше ширины исходного изображения.
     * Сумма значений полей «сверху» и «сторона» не должна быть больше высоты исходного изображения.
     * Поля «сверху» и «слева» не могут быть отрицательными.
     */
    if (utilities.fieldLeft.value >= 0 && utilities.fieldTop.value >= 0) {
      var sumFieldLeftAndSide = Number(utilities.fieldLeft.value) + Number(utilities.side.value);
      var sumFieldTopAndSide = Number(utilities.fieldTop.value) + Number(utilities.side.value);

      var naturalWidth = currentResizer._image.naturalWidth;
      var naturalHeight = currentResizer._image.naturalHeight;

      if (sumFieldLeftAndSide <= naturalWidth &&
        sumFieldTopAndSide <= naturalHeight) {
        utilities.fwdButton.disabled = false;
        return true;
      } else {
        showMessage(Action.SIZE_INVALID);
        utilities.fwdButton.disabled = true;
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;

      case Action.SIZE_INVALID:
        isError = true;
        message = message || 'Неверные параметры кадрирования<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
      //вытаскиваем фильтр из куки
      var filter = browserCookies.get('filter');

      if (filter) {
        var actualFilter = document.querySelector('#upload-filter-' + filter);
        actualFilter.setAttribute('checked', 'checked');
        filterImage.className = 'filter-image-preview filter-' + filter;
      }
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */

  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();
    //Записываем выбранный фильтр в куки
    var selectedFilter = filterForm['upload-filter'].value;
    browserCookies.set('filter', selectedFilter, {expires: getDaysForCookies()});

    function getDaysForCookies() {

      var dateNow = new Date();
      var yearNow = dateNow.getFullYear();
      var dateOfBirth = new Date(yearNow, 2, 11);
      var daysAfterBirth = new Date();
      var daysForCookies = new Date();
      //Проверка натсупил ли уже др в этом году
      if (dateNow >= dateOfBirth) {
        daysAfterBirth = dateNow - dateOfBirth;
      } else {
        var dateOfBirthPreviousYear = new Date(yearNow - 1, 2, 11);
        daysAfterBirth = dateNow - dateOfBirthPreviousYear;
      }
      //Переводим миллисекунды в кол-во суток и устанавливаем их в качестве даты жизни куки
      daysForCookies.setDate(dateNow.getDate() + Math.floor(daysAfterBirth / (1000 * 60 * 60 * 24)));
      return daysForCookies;
    }

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  resizeForm.addEventListener('input', function() {
    if (resizeFormIsValid()) {
      currentResizer.setConstraint(+utilities.fieldLeft.value, +utilities.fieldTop.value, +utilities.side.value);
    }
  });

  window.addEventListener('resizerchange', function() {
    var borderSize = currentResizer.getConstraint();
    utilities.fieldLeft.value = borderSize.x;
    utilities.fieldTop.value = borderSize.y;
    utilities.side.value = borderSize.side;
//    resizeFormIsValid();
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

  cleanupResizer();
  updateBackground();
})();
