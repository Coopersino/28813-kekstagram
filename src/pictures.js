'use strict';
var filtersBlock = document.querySelector('.filters');
var picturesContainer = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture-template');
var cloneElement = undefined;
var imageLoadTimeout = undefined;

var IMAGE_TIMEOUT = 10000; //устанавливаем таймаут 10 секунд

filtersBlock.classList.add('hidden');

if ('content' in pictureTemplate) {
  cloneElement = pictureTemplate.content.querySelector('.picture');
} else {
  cloneElement = pictureTemplate.querySelector('.picture');
}

var getPicture = function (data, container) {
  var element = cloneElement.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;
  container.appendChild(element);

  var pictureItem = element.querySelector('img');
  pictureItem.width = 182;
  pictureItem.height = 182;

  pictureItem.onload = function () {
    clearTimeout(imageLoadTimeout);
  };
  pictureItem.onerror = function () {
    element.classList.add('picture-load-failure');
  };

  pictureItem.src = data.url;
  imageLoadTimeout = setTimeout(function () {
    pictureItem.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_TIMEOUT);
};

var arrayPictures = window.pictures;
arrayPictures.forEach(function (picture) {
  getPicture(picture, picturesContainer);
});