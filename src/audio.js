const THREE = require('three');
var context;
var sourceNode;
var jsNode;
var analyser;
var splitter;

function init() {
  if (! window.AudioContext) { // check if the default naming is enabled, if not use the chrome one.
      if (! window.webkitAudioContext) alert('no audiocontext found');
      window.AudioContext = window.webkitAudioContext;
  }
  context = new AudioContext();
  setupAudioNodes();
  loadSound("./audio/the-deli-flowers.mp3");
}

// load the specified sound
function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      playSound(buffer);
    }, (e) => {console.log(e)});
  }
  request.send();
}

function playSound(buffer) {
    sourceNode.buffer = buffer;
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

export default {
  init: init,
  getSizeFromSound: getSizeFromSound,
  getColorFromSound: getColorFromSound,
  getRateFromSound: getRateFromSound
}
