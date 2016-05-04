'use strict';

var Filter = {
  'POPULAR': 'filter-popular',
  'NEW': 'filter-new',
  'DISCUSSED': 'filter-discussed'
};

module.exports = {
  filtersBlock: document.querySelector('.filters'),
  cloneElement: '',
  PAGE_SIZE: 12,
  TIMEOUT: 10000, //устанавливаем таймаут 10 секунд
  PICTURES_LOAD_URL: '//o0.github.io/assets/json/pictures.json',
  picturesContainer: document.querySelector('.pictures'),
  currentResizer: '',
  fieldLeft: document.querySelector('#resize-x'),
  fieldTop: document.querySelector('#resize-y'),
  side: document.querySelector('#resize-size'),
  fwdButton: document.querySelector('#resize-fwd'),
  Filter: {
    'POPULAR': 'filter-popular',
    'NEW': 'filter-new',
    'DISCUSSED': 'filter-discussed'
  },
  DEFAULT_FILTER: Filter.POPULAR
};
