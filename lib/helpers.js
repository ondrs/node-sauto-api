'use strict';


module.exports = {

  /**
   *
   * @param {Object} result
   * @return {{error: boolean, id: (car_id|*)}}
   */
  parseCarErrors: function(result) {
    var error = false;

    if (result.output.error_items && result.output.error_items instanceof Array) {

      error = result.status_message;

      result.output.error_items.forEach(function (e) {
        error += ' ' + e.item + ': ' + e.error_message + '; ';
      });

      error = error.trim();
    }

    return {
      error: error,
      id: result.output.car_id
    };
  },


  /**
   *
   * @param {Object} result
   * @return {{error: boolean, id: *}}
   */
  parsePhotoErrors: function(result) {
    var error = false;

    if (result.output.error_items && result.output.error_items instanceof Array) {

      error = result.status_message;

      result.output.error_items.forEach(function (e) {
        error += ' ' + e.item + ': ' + e.error_message + '; ';
      });

      error = error.trim();
    }

    return {
      error: error,
      id: result.output.photo_id
    };
  },

  /**
   *
   * @param {Object} output
   * @return {{error: boolean, id: *}}
   */
  parseEquipErrors: function(result) {
    var error = false;

    if (result.output.error_equipment && result.output.error_equipment instanceof Array) {

      error = result.status_message;

      result.output.error_equipment.forEach(function (e) {
        error += ' ' + e.equipment + ': ' + e.error_message + '; ';
      });

      error = error.trim();
    }

    return {
      error: error,
      id: result.output.photo_id
    };
  }
};
