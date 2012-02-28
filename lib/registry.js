// var EventEmitter = require('events').EventEmitter
//   ;

exports.createRegistry = function(serviceType, serviceVersion) {
  var self = {}
    , store = {}
    ;

    function create(key, object, cb) {
      object.mtime = +Date.now();
      store[key] = object;
      cb && cb(null, object);
    }

    function read(key, cb) {
      cb && cb(null, store[key]);
    }

    function update(key, object, cb) {
      cb && cb(null, object);
    }

    function del(key, cb) {
      delete store[key];
      cb && cb();
    }

    self.create = create;
    self.read = read;
    self.update = update;
    self.delete = del;

  return self;
};