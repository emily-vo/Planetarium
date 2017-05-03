const THREE = require('three');
import pitchHelper from './pitchHelper'
import { analyze, guess } from 'web-audio-beat-detector';
var playing = false;
var context;
var sourceNode, sourceJs;
var gainNode;
var analyser;
var buffer;
var jsNode;
var splitter;
var array = new Array();
var reset = true;
var tempo = 0;
function init(path, initWorlds) {
  if (! window.AudioContext) { // check if the default naming is enabled, if not use the chrome one.
      if (! window.webkitAudioContext) alert('no audiocontext found');
      window.AudioContext = window.webkitAudioContext;
  }
  context = new AudioContext();
  loadSound(path, initWorlds);
}

// load the specified sound
function loadSound(url, initWorlds) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      if(!buffer) {
          // Error decoding file data
          return;
      }
      sourceNode = context.createBufferSource();
      sourceNode.buffer = buffer;

      sourceJs = context.createScriptProcessor(2048, 1, 1);
      sourceJs.buffer = buffer;

      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 512;

      sourceNode.connect(analyser);
      analyser.connect(sourceJs);

      gainNode = context.createGain();
      sourceNode.connect(gainNode);
      sourceJs.connect(gainNode);
      gainNode.connect(context.destination);
      reset = true;

      detectBeat();
      initWorlds();
      playing = true;
    }, (e) => {console.log(e)});
  }
  request.send();
}

function playOnLoad(url, updateAnalysers) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      if(!buffer) {
          // Error decoding file data
          return;
      }
      sourceNode = context.createBufferSource();
      sourceNode.buffer = buffer;

      sourceJs = context.createScriptProcessor(2048, 1, 1);
      sourceJs.buffer = buffer;

      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 512;

      sourceNode.connect(analyser);
      analyser.connect(sourceJs);

      gainNode = context.createGain();
      sourceNode.connect(gainNode);
      sourceJs.connect(gainNode);
      gainNode.connect(context.destination);

      detectBeat();

      playSound();
      updateAnalysers();
    }, (e) => {console.log(e)});
  }
  request.send();
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

function setMusic(name, updateAnalysers) {
  stopSound();
  playOnLoad('./audio/' + name + '.mp3', updateAnalysers);
}

function playSound() {
  sourceNode.start(0);
  playing = true;
}

function getAverageVolume(array) {
   var values = 0;
   for (var i = 0; i < array.length; i++) {
     values += array[i];
   }
   return values / array.length;
}

// Calculated based on the volume / amplitude
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
// Calculated based on the pitch of the audio
function getColorFromSound(oldColor) {
  var color = oldColor;
    var pitch = detectPitch();
    if (pitch) {
      var hex = Math.floor(pitch).toString(16);
      hex = ("000" + hex).substr(-3);
      color = new THREE.Color("#" + hex);

      var r = 0.9 * oldColor.r + 0.1 * color.r;
      var g = 0.9 * oldColor.g + 0.1 * color.g;
      var b = 0.9 * oldColor.b + 0.1 * color.b;
      color = new THREE.Color(r/1.1,g/1.2,b);
      // console.log(color);
    }
  return color;
}

// Detects the bpm and returns it (tempo)
// Only needs to be called once per song
function detectBeat() {
  analyze(sourceNode.buffer)
    .then((tmp) => {
        console.log("Tempo: "  + tmp)
        tempo = tmp
        return tmp;
    })
    .catch((err) => { console.log(err) });
}

function getRateFromSound() {
  // var offset = (tempo - 140) / 2000
  // return offset;
  return tempo;
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
  mute: mute,
  unmute: unmute,
  setMusic: setMusic,
  isPlaying: isPlaying,
  getSizeFromSound: getSizeFromSound,
  getColorFromSound: getColorFromSound,
  getRateFromSound: getRateFromSound
}
