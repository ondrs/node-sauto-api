var SautoApi = require(__dirname + '/../lib/index');
var expect = require('chai').expect;
var should = require('chai').should;


var login = 'import',
  password = 'test',
  config = {
    "connection" : {
      "host": "import.sauto.cz",
        "port": 80,
        "path": "/RPC2"
    },
    "swKey": "testkey-571769"
  };

var api = new SautoApi(config, login, password);

describe('Sauto API tests', function() {

  this.timeout(10000);


  describe('without login', function() {

    it('should print version', function(done) {

      api
        .version()
        .done(function(version) {
          expect(version).to.be.a('string');
          done();
        });
    });


    it('should login and logout', function(done) {

      api
        .login()
        .then(function() {
          return api.logout()
        })
        .done(function() {
          done();
        })
    });

  });

  describe('logged', function() {

    before(function(done) {
      api
        .login()
        .done(function() {
          done();
        });
    });

    after(function(done) {
      api
        .logout()
        .done(function() {
          done();
        });
    });


    it('should get list of cars', function(done) {
      api
        .listOfCars()
        .done(function(ids) {
          expect(ids).to.be.instanceOf(Array);
          done();
        })
    });


    // TODO: implement...

    it('should add car');
    it('should get a car');
    it('should edit car');
    it('should get a car');
    it('should get car id');

    it('should get list of photos');
    it('should get list of equipment');

    it('should add photo');
    it('should get photo id');
    it('should delete photo');

    it('should add equipment');

    it('should add video');
    it('should delete video');

    it('should delete car');

  });





});

