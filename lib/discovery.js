var Registry = require('./registy').createRegistry
  , EventEmitter = require('events').EventEmitter
  , mdns = require('mdns')
  ;

exports.discovery = function(serviceType, serviceVersion) {
  var self = new EventEmitter()
    , registry = new Registry()
    , mdnsBrowser = new mdns.Browser(mdns.udp(serviceType, 'v' + serviceVersion))
    ;

  mdns.on('serviceUp', serviceUp);
  mdns.on('serviceDown', serviceDown);

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
    registry.keys.forEach(function(value, index, array) {
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

  return self;
};