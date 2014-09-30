'use strict';

var md5 = require('MD5'),
  xmlrpc = require('xmlrpc'),
  Helpers = require('./helpers'),
  Q = require('q');


/**
 *
 * @param {Object} config
 * @param {string} login
 * @param {string} password
 * @constructor
 */
function SautoApi(config, login, password) {
  this.config_ = config;
  this.login_ = login;
  this.password_ = password;
  this.client_ = xmlrpc.createClient(config.connection);
  this.sessionId_ = null;
}

/**
 * @type {Object}
 * @private
 */
SautoApi.prototype.config_;

/**
 * @type {string}
 * @private
 */
SautoApi.prototype.login_;

/**
 * @type {string}
 * @private
 */
SautoApi.prototype.password_;

/**
 * @type {Client}
 * @private
 */
SautoApi.prototype.client_;

/**
 * @type {string}
 * @private
 */
SautoApi.prototype.sessionId_;


/**
 * Create hash
 * @private
 * @returns {Q.promise}
 */
SautoApi.prototype.getHashInternal_ = function () {
  var self = this;
  var deferred = Q.defer();

  this.client_.methodCall('getHash', [self.login_], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on getHash');
    else if (result.status !== 200)  deferred.reject(result.status_message);
    else {
      deferred.resolve({
        sessionId: result.output.session_id,
        hash: result.output.hash_key
      });
    }

  });

  return deferred.promise;
};


/**
 * Login
 * @private
 * @param {string} sessionId
 * @param {string} hash
 * @returns {Q.promise}
 */
SautoApi.prototype.loginInternal_ = function (sessionId, hash) {
  var self = this;
  var deferred = Q.defer();
  var password = md5(md5(self.password_) + hash);

  self.client_.methodCall('login', [sessionId, password, self.config_.swKey], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result) deferred.reject('No result on login');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else deferred.resolve(sessionId);
  });

  return deferred.promise;
};


/**
 * Login
 * @returns {Q.promise}
 */
SautoApi.prototype.login = function () {
  var self = this;
  var deferred = Q.defer();

  self
    .getHashInternal_(self.login_)
    .then(function (result) {
      return self.loginInternal_(result.sessionId, result.hash);
    })
    .then(function (sessionId) {

      self.sessionId_ = sessionId;
      deferred.resolve(sessionId);

    }, function (err) {
      deferred.reject(err);
    });


  return deferred.promise;
};


/**
 *
 * @returns {boolean}
 */
SautoApi.prototype.isLogged = function () {
  if (this.sessionId_ === null)  throw 'SessionId is not set. You must call login() at the beginning';
  else return true;
};


/**
 * Get list of cars
 * @returns {Q.promise}
 */
SautoApi.prototype.listOfCars = function () {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('listOfCars', [self.sessionId_, 'all'], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on listOfCars');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else {

      var cars = [];
      for (var i in result.output.list_of_cars)
        cars.push(result.output.list_of_cars[i]);

      deferred.resolve(cars);
    }

  });

  return deferred.promise;
};


/**
 * Get car details
 * @param {number} carId
 * @returns {Q.promise}
 */
SautoApi.prototype.getCar = function (carId) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('getCar', [self.sessionId_, carId], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on getCar');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else deferred.resolve(result.output);
  });

  return deferred.promise;
};


/**
 * Get list of photos by car id
 * @param {number} carId
 * @returns {Q.promise}
 */
SautoApi.prototype.listOfPhotos = function (carId) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('listOfPhotos', [self.sessionId_, carId], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on listOfPhotos');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else {

      var photos = [];
      for (var i in result.output.list_of_photos)
        photos.push(result.output.list_of_photos[i]);

      deferred.resolve(photos);
    }
  });

  return deferred.promise;
};


/**
 * Get list of equipment by car id
 * @param {number} carId
 * @returns {Q.promise}
 */
SautoApi.prototype.listOfEquipment = function (carId) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('listOfEquipment', [self.sessionId_, carId], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on listOfEquipment');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else {

      var equips = [];
      for (var i in result.output.equipment)
        equips.push(result.output.equipment[i]);

      deferred.resolve(equips);
    }
  });

  return deferred.promise;
};


/**
 *
 * @returns {Q.promise}
 */
SautoApi.prototype.logout = function () {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('logout', [self.sessionId_], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result) deferred.reject('No result on logout');
    else if (result.status !== 210) deferred.reject(result.status_message);
    else {
      self.sessionId_ = null;
      deferred.resolve(result);
    }
  });

  return deferred.promise;
};


/**
 *
 * @returns {Q.promise}
 */
SautoApi.prototype.version = function () {
  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('version', [], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on logout');
    else if (result.status !== 200)  deferred.reject(result.status_message);
    else deferred.resolve(result.output.version);
  });

  return deferred.promise;
};


/**
 *
 * @param {Object} car
 * @returns {Q.promise}
 */
SautoApi.prototype.addEditCar = function (car) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('addEditCar', [self.sessionId_, car], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on addEditCar');
    else {

      var obj = Helpers.parseCarErrors(result);

      if (obj.error && result.status !== 200) {
        deferred.reject(obj);
      } else {
        deferred.resolve(obj)
      }
    }

  });

  return deferred.promise;
};


/**
 *
 * @param {string} customId
 * @returns {Q.promise}
 */
SautoApi.prototype.getCarId = function (customId) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('getCarId', [self.sessionId_, customId], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on getCarId');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else deferred.resolve(result.output.car_id);
  });

  return deferred.promise;
};


/**
 *
 * @param {number} carId
 * @returns {Q.promise}
 */
SautoApi.prototype.delCar = function (carId) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('delCar', [self.sessionId_, carId], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result) deferred.reject('No result on delCar');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else deferred.resolve(result);
  });

  return deferred.promise;
};


/**
 *
 * @param {number} carId
 * @param {Object} photoData
 * @returns {Q.promise}
 */
SautoApi.prototype.addEditPhoto = function (carId, photoData) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('addEditPhoto', [self.sessionId_, carId, photoData], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on addEditPhoto');
    else {

      var obj = Helpers.parsePhotoErrors(result);

      if (obj.error && result.status !== 200) {
        deferred.reject(obj);
      } else {
        deferred.resolve(obj)
      }
    }
  });

  return deferred.promise;
};


/**
 *
 * @param {number} photoId
 * @returns {Q.promise}
 */
SautoApi.prototype.delPhoto = function (photoId) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('delPhoto', [self.sessionId_, photoId], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result) deferred.reject('No result on delPhoto');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else deferred.resolve(result);
  });

  return deferred.promise;
};


/**
 *
 * @param {number} carId
 * @param {string} customId
 * @returns {Q.promise}
 */
SautoApi.prototype.getPhotoId = function (carId, customId) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('getPhotoId', [self.sessionId_, carId, customId], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result || !result.output) deferred.reject('No result on getPhotoId');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else deferred.resolve(result.output.photo_id);
  });

  return deferred.promise;
};


/**
 *
 * @param {number} carId
 * @param {Array} equips
 * @returns {Q.promise}
 */
SautoApi.prototype.addEquipment = function (carId, equips) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('addEquipment', [self.sessionId_, carId, equips], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result) deferred.reject('No result on addEquipment');
    else {

      var obj = Helpers.parseEquipErrors(result);

      if (obj.error && result.status !== 200) {
        deferred.reject(obj);
      } else {
        deferred.resolve(obj)
      }
    }
  });

  return deferred.promise;
};


/**
 *
 * @param {number} carId
 * @param {Object} videoData
 * @returns {Q.promise}
 */
SautoApi.prototype.addVideo = function (carId, videoData) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('addVideo', [self.sessionId_, carId, videoData], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result) deferred.reject('No result on addVideo');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else deferred.resolve(result);
  });

  return deferred.promise;
};


/**
 *
 * @param {number} carId
 * @returns {Q.promise}
 */
SautoApi.prototype.delVideo = function (carId) {
  this.isLogged();

  var self = this;
  var deferred = Q.defer();

  self.client_.methodCall('delVideo', [self.sessionId_, carId], function (err, result) {

    if (err) deferred.reject(err);
    else if (!result) deferred.reject('No result on delVideo');
    else if (result.status !== 200) deferred.reject(result.status_message);
    else deferred.resolve(result.status_message);
  });

  return deferred.promise;
};

module.exports = SautoApi;
