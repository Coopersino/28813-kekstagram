'use strict';

var Gallery = function() {
  this.gallContainer = document.querySelector('.gallery-overlay');
  this.picItems = [];
  this.currentPicIndex = 0;
  var gallImage = this.gallContainer.querySelector('.gallery-overlay-image');
  var gallCommentsCount = this.gallContainer.querySelector('.comments-count');
  var gallLikesCount = this.gallContainer.querySelector('.likes-count');
  var gallCloseBtn = this.gallContainer.querySelector('.gallery-overlay-close');

  // принимаем на вход массив объектов, описывающих фотографии, и сохраняем их
  this.setGalleryPics = function(picturesArray) {
    this.picItems = picturesArray;
    return this.picItems;
  };

  // Показать фото в галерее
  this.showPicsInGallary = function() {
    var currentPic = this.picItems[this.currentPicIndex];
    gallImage.src = currentPic.url;
    gallCommentsCount.textContent = currentPic.comments;
    gallLikesCount.textContent = currentPic.likes;
  };

  // Показать галерею
  this.showGallery = function(index) {
    this.currentPicIndex = index;
    this.showPicsInGallary();
    gallImage.addEventListener('click', this._onPhotoClick.bind(this));
    this.gallContainer.classList.remove('invisible');
    gallCloseBtn.addEventListener('click', this._onCloseClick.bind(this));
    document.addEventListener('keydown', this._onDocumentKeyDown.bind(this));
    this.gallContainer.addEventListener('click', this._onContainerClick.bind(this));
  };

  // Скрываем галерею и удаляем все обработчики событий
  this.hideGallery = function() {
    this.gallContainer.classList.add('invisible');
    gallImage.removeEventListener('click', this._onPhotoClick.bind(this));
    document.removeEventListener('keydown', this._onDocumentKeyDown.bind(this));
    this.gallContainer.removeEventListener('click', this._onContainerClick.bind(this));
  };

  // Обработчик события клика по фотографии _onPhotoClick, который показывает следующую фотографию.
  this._onPhotoClick = function(evt) {
    evt.preventDefault();
    if (this.currentPicIndex <= this.picItems.length) {
      this.currentPicIndex++;
      this.showPicsInGallary();
    } else {
      this.currentPicIndex = 0;
    }
  };

  this._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hideGallery();
  };

  // ESC - закрываем галлерею
  this._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      this.hideGallery();
    }
  };

  // Закрытие галереи по клику на черный оверлей вокруг фотографии
  this._onContainerClick = function(evt) {
    if (evt.target.classList.contains('gallery-overlay')) {
      evt.preventDefault();
      this.hideGallery();
    }
  };
};

module.exports = new Gallery();
