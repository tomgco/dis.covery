// var EventEmitter = require('events').EventEmitter
//   ;

exports.createRegistry = function(serviceType, serviceVersion) {
  var self = {}
    , store = {}
    ;

    function create(key, object, cb) {
      object.mtime = +Date.now();
      object.online = true;
      store[key] = object;
      cb && cb(null, object);
    }

    function read(key, cb) {
      cb && cb(null, store[key]);
    }

    function readAll(cb) {
      cb && cb(null, store);
    }

    function update(key, object, cb) {
      store[key] = object;
      cb && cb(null, object);
    }

    function del(key, cb) {
      // delete store[key];
      read(key, function(err, obj) {
        obj.online = false;
        update(key, obj, cb);
      });
    }

    self.create = create;
    self.read = read;
    self.update = update;
    self.delete = del;
    self.readAll = readAll;

  return self;
};