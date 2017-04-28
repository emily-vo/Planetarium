const THREE = require('three');
import pitchHelper from './pitchHelper'
var playing = false;
var context;
var sourceNode;
var gainNode;
var analyser;
var splitter;

function init() {
  if (! window.AudioContext) { // check if the default naming is enabled, if not use the chrome one.
      if (! window.webkitAudioContext) alert('no audiocontext found');
      window.AudioContext = window.webkitAudioContext;
  }
  context = new AudioContext();
  setupAudioNodes();
  loadSound("./audio/smooth-operator.mp3");
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
  playing = true;
}

function stopSound() {
  sourceNode.stop();
  playing = false;
}

function mute() {
  gainNode.gain.value = 0;
}

function unmute(){
  gainNode.gain.value = 1;
}

function isPlaying() {
  return playing;
}

function setMusic(name) {
  stopSound();
  setupAudioNodes();
  loadSound('./audio/' + name + '.mp3');
}

function setupAudioNodes() {
  sourceNode = context.createBufferSource();
  // sourceNode.connect(context.destination);

  // jsNode = context.createScriptProcessor(2048, 1, 1); //ScriptProcessorNode

  analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 2048;

  // splitter = context.createChannelSplitter(); // splits into left and right stream

  sourceNode.connect(analyser);

  gainNode = context.createGain();
  sourceNode.connect(gainNode);
  gainNode.connect(context.destination);
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


function detectPitch() {
	var buffer = new Uint8Array(analyser.fftSize);
	analyser.getByteTimeDomainData(buffer);

	var fundamentalFreq = pitchHelper.findFundamentalFreq(buffer,context.sampleRate);

	if (fundamentalFreq !== -1) {
    return fundamentalFreq
  }
}

// Returns a new color based on the given color
function getColorFromSound(oldColor) {
  var color = oldColor;
    var pitch = detectPitch()
    if (pitch) {
      var hex = Math.floor(pitch).toString(16)
      hex = ("000" + hex).substr(-3)
      color = new THREE.Color("#" + hex)

      var r = 0.8 * oldColor.r + 0.2 * color.r
      var g = 0.8 * oldColor.g + 0.2 * color.g
      var b = 0.8 * oldColor.b + 0.2 * color.b
      color = new THREE.Color(r,g,b)
    }
  return color;
}

function getRateFromSound() {
  //TODO: implement according to bpm
  return 0;
}


export default {
  init: init,
  mute: mute,
  unmute: unmute,
  setMusic: setMusic,
  isPlaying: isPlaying,
  getSizeFromSound: getSizeFromSound,
  getColorFromSound: getColorFromSound,
  getRateFromSound: getRateFromSound
}
