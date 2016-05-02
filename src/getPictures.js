'use strict';

var utilities = require('./utilities');

var loadingError = function() {
  utilities.picturesContainer.classList.add('pictures-failure');
  utilities.picturesContainer.classList.remove('pictures-loading');
};

module.exports = {
  getPictures: function(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(evt) {
      utilities.picturesContainer.classList.add('pictures-loading');
      var loadDate = JSON.parse(evt.target.response);
      callback(loadDate);
    };
    xhr.onerror = loadingError;
    xhr.timeout = utilities.TIMEOUT;
    xhr.ontimeout = loadingError;

    xhr.open('GET', utilities.PICTURES_LOAD_URL);
    xhr.send();
  }
};
