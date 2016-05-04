'use strict';

var utilities = require('./utilities');
var getPictures = require('./getPictures');
var render = require('./render');
var filterModule = require('./filter');
var Gallery = require('./gallery');

var picturesContainer = document.querySelector('.pictures');

var pictureTemplate = document.querySelector('#picture-template');

var pictures = [];

var filteredPictures = [];

var renderedPictures = [];

var pageNumber = 0;

utilities.filtersBlock.classList.add('hidden');

if ('content' in pictureTemplate) {
  utilities.cloneElement = pictureTemplate.content.querySelector('.picture');
} else {
  utilities.cloneElement = pictureTemplate.querySelector('.picture');
}

var isNextPageAvailable = function(picturesArray, page) {
  return page < Math.floor(pictures.length / utilities.PAGE_SIZE);
};

var isPageBottom = function() {
  var viewport = window.innerHeight + 20;
  var picturesBottom = picturesContainer.getBoundingClientRect().bottom;
  return picturesBottom < viewport;
};

var isPageNotFull = function() {
  var picturesBottom = utilities.picturesContainer.getBoundingClientRect().bottom;
  return picturesBottom < window.innerHeight;
};

var renderPictures = function(picturesArray, page, replace) {
//  pictures = picturesArray;
  if (replace) {
    utilities.picturesContainer.innerHTML = '';
  }
  var from = page * utilities.PAGE_SIZE;
  var to = from + utilities.PAGE_SIZE;
  picturesArray.slice(from, to).forEach(function(picture) {
    renderedPictures.push(new render.Photo(picture, picturesContainer, picturesArray));
  });
  Gallery._onHashChange();
};

var setPageFull = function() {
  while (isPageNotFull() &&
    isNextPageAvailable(filteredPictures, pageNumber)) {
    pageNumber++;
    renderPictures(filteredPictures, pageNumber);
  }
};

var setScrollEnabled = function() {
  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (isPageBottom() &&
        isNextPageAvailable(filteredPictures, pageNumber)) {
        pageNumber++;
        renderPictures(filteredPictures, pageNumber);
      }
    }, 100);
  });
};

var setFilterEnabled = function(filter) {
  filteredPictures = filterModule.getFilteredPictures(pictures, filter);
  pageNumber = 0;
  Gallery.setGalleryPics(filteredPictures);
  renderPictures(filteredPictures, pageNumber, true);
  setPageFull();
};

var setFiltrationEnabled = function() {
  utilities.filtersBlock.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      setFilterEnabled(evt.target.id);
      filterModule.setFilterInLocalStorage(evt.target.id);
    }
  });
};

getPictures.getPictures(function(loadPictures) {
  pictures = loadPictures;
  setScrollEnabled();
  setFiltrationEnabled(true);
  setFilterEnabled(filterModule.getCurrentFilter());
  utilities.picturesContainer.classList.remove('pictures-loading');
  utilities.filtersBlock.classList.remove('hidden');
});
