'use strict';

var utilities = require('./utilities');
var filterModule = require('./filter');
var galleryModule = require('./gallery');
var pictures;

var getPictureElement = function(data, container) {
  var element = utilities.cloneElement.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;
  container.appendChild(element);

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

// Обработчик события при клике на галерею
  element.addEventListener('click', function(evt) {
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

    galleryModule.showGallery(index);
    return true;
  });

};

module.exports = {
  renderPictures: function(picturesArray, page, replace) {
    pictures = picturesArray;
    if (replace) {
      utilities.picturesContainer.innerHTML = '';
    }
    var from = page * utilities.PAGE_SIZE;
    var to = from + utilities.PAGE_SIZE;
    picturesArray.slice(from, to).forEach(function(picture) {
      getPictureElement(picture, utilities.picturesContainer);
    });
  }
};
