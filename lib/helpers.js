'use strict';

var _ = require('underscore');

module.exports = {

  /**
   *
   * @param {Object} result
   * @return {{error: boolean, id: (car_id|*)}}
   */
  parseCarErrors: function(result) {
    var error = result.status !== 200 ? result.status_message : false;
    var carId = null;

    if(result.output) {

      carId = result.output.car_id;

      if (result.output.error_items) {

        var items = _.map(result.output.error_items, function (e) {
          return e.item + ': ' + e.error_message;
        });

        if(items.length) {
          error += ' ' + items.join('; ');
        }
      }

    }

    return {
      error: error,
      id: carId
    };
  },


  /**
   *
   * @param {Object} result
   * @return {{error: boolean, id: *}}
   */
  parsePhotoErrors: function(result) {
    var error = result.status !== 200 ? result.status_message : false;
    var photoId = null;

    if(result.output) {

      photoId = result.output.photo_id;

      if (result.output.error_items) {

        var items = _.map(result.output.error_items, function (e) {
          return e.item + ': ' + e.error_message;
        });

        if(items.length) {
          error += ' ' + items.join('; ');
        }
      }

    }

    return {
      error: error,
      id: photoId
    };
  },

  /**
   *
   * @param {Object} result
   * @return {{error: boolean, id: *}}
   */
  parseEquipErrors: function(result) {
    var error = result.status !== 200 ? result.status_message : false;

    if (result.output.error_equipment) {

      var items = _.map(result.output.error_equipment, function (e) {
        return e.equipment_id + ': ' + e.error_message;
      });

      if(items.length) {
        error += ' ' + items.join('; ');
      }

    }

    return {
      error: error,
      id: null
    };
  }
};
