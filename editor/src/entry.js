const run = require('./index.js');
if (window.monaco) {
  run();
} else {
  window.onMonacoReady = run;
}
