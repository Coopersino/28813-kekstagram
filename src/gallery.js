'use strict';

var Gallery = function() {
  this.gallContainer = document.querySelector('.gallery-overlay');
  this.picItems = [];
  this.currentPicIndex = 0;
  this.gallImage = this.gallContainer.querySelector('.gallery-overlay-image');
  this.gallCommentsCount = this.gallContainer.querySelector('.comments-count');
  this.gallLikesCount = this.gallContainer.querySelector('.likes-count');
  this.gallCloseBtn = this.gallContainer.querySelector('.gallery-overlay-close');

  this._onPhotoClick = this._onPhotoClick.bind(this);
  this._onCloseClick = this._onCloseClick.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onContainerClick = this._onContainerClick.bind(this);

  window.addEventListener('hashchange', this._onHashChange.bind(this));
};

// принимаем на вход массив объектов, описывающих фотографии, и сохраняем их
Gallery.prototype.setGalleryPics = function(picturesArray) {
  this.picItems = picturesArray;
  return this.picItems;
};

// Показать фото в галерее
Gallery.prototype.showPicsInGallery = function(hash) {
  var currentPic;

  if (hash) {
    currentPic = this.picItems.find(function(picture) {
      return hash.indexOf(picture.url) !== -1;
    });
  } else {
    currentPic = this.picItems[this.currentPicIndex];
  }

  this.currentPicIndex = this.picItems.indexOf(currentPic);
  this.gallImage.src = currentPic.url;
  this.gallCommentsCount.textContent = currentPic.comments;
  this.gallLikesCount.textContent = currentPic.likes;
};

// Показать галерею
Gallery.prototype.showGallery = function(hash) {
  this.showPicsInGallery(hash);
  this.gallImage.addEventListener('click', this._onPhotoClick);
  this.gallContainer.classList.remove('invisible');
  this.gallCloseBtn.addEventListener('click', this._onCloseClick);
  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.gallContainer.addEventListener('click', this._onContainerClick);
};

// Скрываем галерею и удаляем все обработчики событий
Gallery.prototype.hideGallery = function() {
  this.gallContainer.classList.add('invisible');
  this.gallImage.removeEventListener('click', this._onPhotoClick);
  this.gallCloseBtn.removeEventListener('click', this._onCloseClick);
  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.gallContainer.removeEventListener('click', this._onContainerClick);
  window.location.hash = '';
};

// Обработчик события клика по фотографии _onPhotoClick, который показывает следующую фотографию.
Gallery.prototype._onPhotoClick = function(evt) {
  evt.preventDefault();
  if (this.currentPicIndex <= this.picItems.length) {
    this.currentPicIndex++;
    window.location.hash = 'photo/' + this.picItems[this.currentPicIndex].url;
  } else {
    this.currentPicIndex = 0;
  }
};

Gallery.prototype._onCloseClick = function(evt) {
  evt.preventDefault();
  this.hideGallery();
};

// ESC - закрываем галлерею
Gallery.prototype._onDocumentKeyDown = function(evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    this.hideGallery();
  }
};

// Закрытие галереи по клику на черный оверлей вокруг фотографии
Gallery.prototype._onContainerClick = function(evt) {
  if (evt.target.classList.contains('gallery-overlay')) {
    evt.preventDefault();
    this.hideGallery();
  }
};

Gallery.prototype._onHashChange = function() {
  this.actualHash = window.location.hash;
  this.hashRegExp = new RegExp(/#photo\/(\S+)/);
  if(this.actualHash.match(this.hashRegExp)) {
    this.showGallery(this.actualHash);
  } else {
    this.hideGallery();
  }
};

module.exports = new Gallery();
