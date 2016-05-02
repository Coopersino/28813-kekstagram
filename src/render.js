'use strict';

var utilities = require('./utilities');

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
};

module.exports = {
  renderPictures: function(picturesArray, page, replace) {
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
