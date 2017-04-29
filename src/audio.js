const THREE = require('three');
var context;
var sourceNode, sourceJs;
var analyser;
var buffer;

var jsNode;
var splitter;
var array = new Array();

function init(path) {
  if (! window.AudioContext) { // check if the default naming is enabled, if not use the chrome one.
      if (! window.webkitAudioContext) alert('no audiocontext found');
      window.AudioContext = window.webkitAudioContext;
  }
  context = new AudioContext();
  loadSound(path);
}

// load the specified sound
function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      if(!buffer) {
          // Error decoding file data
          return;
      }

      sourceJs = context.createScriptProcessor(2048, 1, 1);
      sourceJs.buffer = buffer;
      sourceJs.connect(context.destination);
      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.6;
      analyser.fftSize = 512;

      sourceNode = context.createBufferSource();
      sourceNode.buffer = buffer;

      sourceNode.connect(analyser);
      analyser.connect(sourceJs);
      sourceNode.connect(context.destination);
    }, (e) => {console.log(e)});

  }
  request.send();
}

function playSound() {
    sourceNode.start(0);
}

function setupAudioNodes() {
  sourceNode = context.createBufferSource();
  sourceNode.connect(context.destination);

  // jsNode = context.createScriptProcessor(2048, 1, 1); //ScriptProcessorNode

  analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 1024;

  splitter = context.createChannelSplitter(); // splits into left and right stream

  sourceNode.connect(analyser);
}

function getAverageVolume(array) {
   var values = 0;
   for (var i = 0; i < array.length; i++) {
     values += array[i];
   }
   return values / array.length;
}

// Volume / amplitude
function getSizeFromSound() {
  var arr =  new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(arr);
  return getAverageVolume(arr);
}

function getColorFromSound() {
  //TODO: implement according to pitch
  var color = new THREE.Color(0,0,0);
  return color;
}

function getRateFromSound() {
  //TODO: implement according to bpm
  return 0;
}

function getArray() {
  return array;
}
function getSourceJS() {
  return sourceJs;
}
function getAnalyser() {
  return analyser;
}

export default {
  playSound: playSound,
  getAnalyser: getAnalyser,
  getSourceJS: getSourceJS,
  getArray: getArray,
  init: init,
  getSizeFromSound: getSizeFromSound,
  getColorFromSound: getColorFromSound,
  getRateFromSound: getRateFromSound
}
