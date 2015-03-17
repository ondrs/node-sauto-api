var Helpers = require(__dirname + '/../lib/helpers'),
  expect = require('chai').expect;

describe('Helpers tests', function () {

  var obj, obj2;

  before(function () {

    obj = {
      status: 400,
      status_message: 'Some error message',
      output: {
        car_id: 123,
        photo_id: 456,
        error_items: [
          {
            item: 'item1',
            error_message: 'message1'
          },
          {
            item: 'item2',
            error_message: 'message2'
          }
        ]
      }
    };

    obj2 = {
      status: 400,
      status_message: 'Some error message',
      output: {
        car_id: 123,
        photo_id: 456,
        error_items: {
          0: {
            item: 'item1',
            error_message: 'message1'
          },
          1: {
            item: 'item2',
            error_message: 'message2'
          }
        }
      }
    };

  });



  it('should parseCarErrors where the error_items is the array', function () {
    var result = Helpers.parseCarErrors(obj);

    expect(result.error).to.eql('Some error message item1: message1; item2: message2');
    expect(result.id).to.eql(123);
  });



  it('should parseCarErrors where the error_items is the object', function () {
    var result = Helpers.parseCarErrors(obj2);

    expect(result.error).to.eql('Some error message item1: message1; item2: message2');
    expect(result.id).to.eql(123);
  });



  it('should parsePhotoErrors where the error_items is the array', function () {
    var result = Helpers.parsePhotoErrors(obj);

    expect(result.error).to.eql('Some error message item1: message1; item2: message2');
    expect(result.id).to.eql(456);
  });



  it('should parsePhotoErrors where the error_items is the object', function () {
    var result = Helpers.parsePhotoErrors(obj2);

    expect(result.error).to.eql('Some error message item1: message1; item2: message2');
    expect(result.id).to.eql(456);
  });



  it('should parseEquipErrors where the error_items is the array', function () {

    obj.output.error_equipment = [
      {
        equipment_id: 1,
        error_message: 'message1'
      },
      {
        equipment_id: 2,
        error_message: 'message2'
      }
    ];

    var result = Helpers.parseEquipErrors(obj);

    expect(result.error).to.eql('Some error message 1: message1; 2: message2');
    expect(result.id).to.eql(null);
  });



  it('should parseEquipErrors where the error_items is the object', function () {

    obj2.output.error_equipment = {
      0: {
        equipment_id: 1,
        error_message: 'message1'
      },
      1: {
        equipment_id: 2,
        error_message: 'message2'
      }
    };

    var result = Helpers.parseEquipErrors(obj2);

    expect(result.error).to.eql('Some error message 1: message1; 2: message2');
    expect(result.id).to.eql(null);
  });

});
