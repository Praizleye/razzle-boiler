const eventEmitter = require("./event.listener");

function emitEvent(event, data) {
  eventEmitter.emit(event, data);
}

module.exports = emitEvent;
