'use strict';


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

      if (result.output.error_items && result.output.error_items instanceof Array) {

        result.output.error_items.forEach(function (e) {
          error += ' ' + e.item + ': ' + e.error_message + '; ';
        });

        error = error.trim();
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

      if (result.output.error_items && result.output.error_items instanceof Array) {

        result.output.error_items.forEach(function (e) {
          error += ' ' + e.item + ': ' + e.error_message + '; ';
        });

        error = error.trim();
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

    if (result.output && result.output.error_equipment && result.output.error_equipment instanceof Array) {

      result.output.error_equipment.forEach(function (e) {
        error += ' ' + e.equipment + ': ' + e.error_message + '; ';
      });

      error = error.trim();
    }

    return {
      error: error,
      id: null
    };
  }
};
