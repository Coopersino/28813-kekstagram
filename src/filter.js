'use strict';
var utilities = require('./utilities');
var filterActual;

module.exports = {
  getFilteredPictures: function(picturesArray, filter) {
    if (filter) {
      filterActual = filter;
    } else {
      filter = filterActual;
    }
    var filteredPictures = picturesArray.slice(0);
    switch (filter) {
      case utilities.Filter.POPULAR: //Ничего делать не нужно, т.к. картинки приходят уже отсортированными по этому принципу
        break;
      case utilities.Filter.NEW:
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
      case utilities.Filter.DISCUSSED:
        filteredPictures.sort(function(prev, next) {
          return next.comments - prev.comments;
        });
        break;
      default:
        break;
    }
    return filteredPictures;
  }
};
