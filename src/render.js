'use strict';

var utilities = require('./utilities');
var filterModule = require('./filter');
var Gallery = require('./gallery');

var getPictureElement = function(data, container) {
  var element = utilities.cloneElement.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  var pictureItem = element.querySelector('img');
  pictureItem.width = 182;
  pictureItem.height = 182;

  var imageLoadTimeout;

  pictureItem.onload = function() {
    clearTimeout(imageLoadTimeout);
  };
  pictureItem.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  pictureItem.src = data.url;
  imageLoadTimeout = setTimeout(function() {
    pictureItem.src = '';
    element.classList.add('picture-load-failure');
  }, utilities.TIMEOUT);

  container.appendChild(element);
  return element;
};
var Photo = function(data, container, pictures) {
  this.data = data;
  this.element = getPictureElement(data, container);
  this._onPhotoListClick = function(evt) {
    evt.preventDefault();
    if (evt.target.nodeName !== 'IMG') {
      return false;
    }
    var list = filterModule.getFilteredPictures(pictures);
    var index = 0;
    for (var i = 0; i < list.length; i++) {
      if (data.url === list[i].url) {
        index = i;
      }
    }

    Gallery.showGallery(index);
    return true;
  };

  this.remove = function() {
    this.element.removeEventListener('click', this._onPhotoListClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this._onPhotoListClick);
  container.appendChild(this.element);
};

module.exports = {
  getPictureElement: getPictureElement,
  Photo: Photo
};
