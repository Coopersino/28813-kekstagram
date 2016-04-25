'use strict';
var filtersBlock = document.querySelector('.filters');
var picturesContainer = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture-template');
var cloneElement;
var imageLoadTimeout;

var IMAGE_TIMEOUT = 10000; //устанавливаем таймаут 10 секунд

var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

var Filter = {
  'POPULAR': 'filter-popular',
  'NEW': 'filter-new',
  'DISCUSSED': 'filter-discussed'
};

var DEFAULT_FILTER = Filter.POPULAR;

filtersBlock.classList.add('hidden');

if ('content' in pictureTemplate) {
  cloneElement = pictureTemplate.content.querySelector('.picture');
} else {
  cloneElement = pictureTemplate.querySelector('.picture');
}

var getPictureElement = function(data, container) {
  var element = cloneElement.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;
  container.appendChild(element);

  var pictureItem = element.querySelector('img');
  pictureItem.width = 182;
  pictureItem.height = 182;

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
  }, IMAGE_TIMEOUT);
};

var renderPictures = function(arrayPictures) {
  picturesContainer.innerHTML = '';
  arrayPictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

var getFilteredPictures = function(pictures, filter) {
  var filteredPictures = pictures.slice(0);
  switch (filter) {
    case Filter.POPULAR: //Ничего делать не нужно, т.к. картинки приходят уже отсортированными по этому принципу
      break;
    case Filter.NEW:
      filteredPictures.filter(function(dateOfPictureCreate) {
        var actualDate = new Date(dateOfPictureCreate.date);
        var dateTwoWeeks = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        return actualDate > dateTwoWeeks;
      });
      filteredPictures.sort(function(prev, next) {
        var newPicture = new Date(next.date);
        var oldPicture = new Date(prev.date);
        return newPicture - oldPicture;
      });
      break;
    case Filter.DISCUSSED:
      filteredPictures.sort(function(prev, next) {
        return next.comments - prev.comments;
      });
      break;
    default:
      break;
  }
  return filteredPictures;
};

var pictures = [];

var setFilterEnabled = function(filter) {
  var filteredPictures = getFilteredPictures(pictures, filter);
  renderPictures(filteredPictures);
};

var setFiltrationEnabled = function(enabled) {
  var filters = filtersBlock.querySelectorAll('.filters-radio');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
      if (enabled) {
        setFilterEnabled(this.id);
      }
    };
  }
};

var loadingError = function(){
  pictures.classList.add('pictures-failure');
};

var getPictures = function(callback, error) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function(evt) {
    picturesContainer.classList.add('pictures-loading');
    var loadDate = JSON.parse(evt.target.response);
    callback(loadDate);
  };
  xhr.onerror = loadingError;
  xhr.timeout = 10000;
  xhr.ontimeout = loadingError;

  xhr.open('GET', PICTURES_LOAD_URL);
  xhr.send();
};

getPictures(function(loadPictures) {
  pictures = loadPictures;
  setFiltrationEnabled(true);
  setFilterEnabled(DEFAULT_FILTER);
  renderPictures(pictures);
  picturesContainer.classList.remove('pictures-loading');
});

filtersBlock.classList.remove('hidden');
