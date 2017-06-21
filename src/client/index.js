
// Base styles
import '../views/styles/style.scss';

import EventEmitter from 'events';

let globalEvents = new EventEmitter;

window.globalEvents = globalEvents;

globalEvents.on('receive_data', function (data) {
  console.log(data);
});
