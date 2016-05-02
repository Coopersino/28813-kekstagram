'use strict';

var utilities = require('./utilities');
var getPictures = require('./getPictures');
var render = require('./render');
var filterModul = require('./filter');

var filtersBlock = document.querySelector('.filters');

var picturesContainer = document.querySelector('.pictures');

var pictureTemplate = document.querySelector('#picture-template');

var pictures = [];

var filteredPictures = [];

var pageNumber = 0;

filtersBlock.classList.add('hidden');

if ('content' in pictureTemplate) {
  utilities.cloneElement = pictureTemplate.content.querySelector('.picture');
} else {
  utilities.cloneElement = pictureTemplate.querySelector('.picture');
}

var isNextPageAvailable = function(picturesArray, page) {
  return page < Math.floor(pictures.length / utilities.PAGE_SIZE);
};

var isPageBotttom = function() {
  var viewport = window.innerHeight + 20;
  var picturesBottom = picturesContainer.getBoundingClientRect().bottom;
  return picturesBottom < viewport;
};

var isPageNotFull = function() {
  var picturesBottom = utilities.picturesContainer.getBoundingClientRect().bottom;
  return picturesBottom < window.innerHeight;
};

var setPageFull = function() {
  while (isPageNotFull() &&
    isNextPageAvailable(filteredPictures, pageNumber)) {
    pageNumber++;
    render.renderPictures(filteredPictures, pageNumber);
  }
};

var setScrollEnabled = function() {
  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (isPageBotttom() &&
        isNextPageAvailable(filteredPictures, pageNumber)) {
        pageNumber++;
        render.renderPictures(filteredPictures, pageNumber);
      }
    }, 100);
  });
};

var setFilterEnabled = function(filter) {
  filteredPictures = filterModul.getFilteredPictures(pictures, filter);
  pageNumber = 0;
  render.renderPictures(filteredPictures, pageNumber, true);
  setPageFull();
};

var setFiltrationEnabled = function() {
  filtersBlock.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      setFilterEnabled(evt.target.id);
    }
  });
};

getPictures.getPictures(function(loadPictures) {
  pictures = loadPictures;
  setScrollEnabled();
  setFiltrationEnabled(true);
  setFilterEnabled(utilities.DEFAULT_FILTER);
  utilities.picturesContainer.classList.remove('pictures-loading');
  filtersBlock.classList.remove('hidden');
});

