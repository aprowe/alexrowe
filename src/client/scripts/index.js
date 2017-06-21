
import EventEmitter from 'events';

// Base styles
import '../styles/style.scss';

let globalEvents = new EventEmitter;
window.globalEvents = globalEvents;

// Initialize with data
globalEvents.on('receive_data', function (data) {
  console.log(data);
});
