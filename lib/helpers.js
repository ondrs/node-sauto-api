'use strict';


module.exports = {

  /**
   *
   * @param {Object} output
   * @return {{error: boolean, id: (car_id|*)}}
   */
  parseCarErrors: function(output) {
    var error = false;

    if (output.error_items && output.error_items instanceof Array) {

      error = result.status_message;

      output.error_items.forEach(function (e) {
        error += ' ' + e.item + ': ' + e.error_message + '; ';
      });

      error = error.trim();
    }

    return {
      error: error,
      id: output.car_id
    };
  },


  /**
   *
   * @param {Object} output
   * @return {{error: boolean, id: *}}
   */
  parsePhotoErrors: function(output) {
    var error = false;

    if (output.error_items && output.error_items instanceof Array) {

      error = result.status_message;

      output.error_items.forEach(function (e) {
        error += ' ' + e.item + ': ' + e.error_message + '; ';
      });

      error = error.trim();
    }

    return {
      error: error,
      id: output.photo_id
    };
  }
};
