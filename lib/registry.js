var EventEmitter = require('events').EventEmitter
  , mdns = require('mdns')
  ;

exports.createRegistry = function(serviceType, serviceVersion) {
  var self = EventEmitter
    , store = []
    , mdnsBrowser = new mdns.Browser(mdns.udp(serviceType, 'v' + serviceVersion))
  ;

  mdns.on('serviceUp', serviceUp);
  mdns.on('serviceDown', serviceDown);

  function serviceUp(service) {
    if (!serviceIsKnown(service)) {
      addItem(service);
    }
  }

  function serviceDown(service) {

  }

  function serviceIsKnown() {

  }

  function clientIsKnown(client) {

  }

  function addItem(service) {
    var client = serviceToAddress(service);
    if (!clientIsKnown(client)) {
      store.push(client);
    }
  }

  function removeItem(service) {

  }

  function serviceToAddress(service) {
    var item = {
        addresses: service.addresses
      , port: service.port
      , host: service.host
    };

    return item;
  }

  return self;
};