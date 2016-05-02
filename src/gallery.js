'use strict';
var gallContainer = document.querySelector('.gallery-overlay');
var gallImage = gallContainer.querySelector('.gallery-overlay-image');
var gallCommentsCount = gallContainer.querySelector('.comments-count');
var gallLikesCount = gallContainer.querySelector('.likes-count');
var gallCloseBtn = gallContainer.querySelector('.gallery-overlay-close');

var picItems = [];

var currentPicIndex = 0;

// Функция принимает на вход массив объектов, описывающих фотографии, и сохраняет их
var getPictures = function(picturesArray) {
  picItems = picturesArray;
  return picItems;
};

// Показать фото в галерее
var showPicsInGallary = function() {
  var currentPic = picItems[currentPicIndex];
  gallImage.src = currentPic.url;
  gallCommentsCount.textContent = currentPic.comments;
  gallLikesCount.textContent = currentPic.likes;
};

// Показать галерею
var showGallery = function(index) {
  currentPicIndex = index;
  showPicsInGallary();
  gallImage.addEventListener('click', _onPhotoClick);
  gallContainer.classList.remove('invisible');
  document.addEventListener('keydown', _onDocumentKeyDown);
  gallContainer.addEventListener('click', _onContainerClick);
};

// Обработчик события клика по фотографии _onPhotoClick, который показывает следующую фотографию.
var _onPhotoClick = function(evt) {
  evt.preventDefault();
  if (currentPicIndex <= picItems.length) {
    currentPicIndex++;
    showPicsInGallary();
  } else {
    currentPicIndex = 0;
  }
};

// Скрываем галерею и удаляем все обработчики событий
var hideGallery = function() {
  gallContainer.classList.add('invisible');
  gallImage.removeEventListener('click', _onPhotoClick);
  document.removeEventListener('keydown', _onDocumentKeyDown);
  gallContainer.removeEventListener('click', _onContainerClick);
};

gallCloseBtn.addEventListener('click', function(evt) {
  evt.preventDefault();
  hideGallery();
});

// ESC - закрываем галлерею
var _onDocumentKeyDown = function(evt) {
  if(evt.keyCode === 27) {
    evt.preventDefault();
    hideGallery();
  }
};

// Закрытие галереи по клику на черный оверлей вокруг фотографии
var _onContainerClick = function(evt) {
  if(evt.target.classList.contains('gallery-overlay')) {
    evt.preventDefault();
    hideGallery();
  }
};

module.exports = {
  showGallery: showGallery,
  setGalleryPics: getPictures
};
