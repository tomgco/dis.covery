var Registry = require('./registry').createRegistry
  , EventEmitter = require('events').EventEmitter
  , mdns = require('mdns')
  ;

exports.discovery = function(serviceType, serviceVersion) {
  var self = new EventEmitter()
    , registry = new Registry()
    , mdnsBrowser = new mdns.Browser(mdns.udp(serviceType, serviceVersion))
    ;

  mdnsBrowser.on('serviceUp', serviceUp);
  mdnsBrowser.on('serviceDown', serviceDown);
  mdnsBrowser.start();

  function serviceUp(service) {
    if (!serviceIsKnown(service)) {
      addItem(service);
    } else {
      updateItem(service);
    }
  }

  function serviceDown(service) {
    if (serviceIsKnown(service)) {
      removeItem(service);
    }
  }

  function serviceIsKnown(service) {
    var found = false;
    Object.keys(registry).forEach(function(value, index, array) {
      if(value === service.name) {
        found = true;
      }
    });
    return found;
  }

  function addItem(service) {
    registry.create(service.name, service);
    self.emit('serviceAdded', service);
  }

  function updateItem(service) {
    registry.read(service.name, function(err, data) {
      if (data.mtime < service.mtime) {
        registry.update(service.name, service);
      }
    });
  }

  function removeItem(service) {
    registry.delete(service.name);
    self.emit('serviceRemoved', service);
  }

  function readItem(service, cb) {
    registry.read(service.read, function(err, data) {
      cb(err, data);
    });
  }

  function listAll(cb) {
    registry.readAll(function(err, data) {
      cb(err, data);
    });
  }

  self.readItem = readItem;
  self.listAll = listAll;

  return self;
};