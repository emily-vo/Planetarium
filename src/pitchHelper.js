// Autocorrelation
// https://developer.microsoft.com/en-us/microsoft-edge/testdrive/demos/webaudiotuner/
function findFundamentalFreq(buffer, sampleRate) {
  var n = 1024, // number of samples for each k
    bestR = 0, // correlation
    bestK = -1; // period we are trying to find

    // Time delay k
    for (var k = 8; k <= 1000; k++) {
			var sum = 0;
			for (var t = 0; t < n; t++) {
        //Check values at times t and t + k
				sum += ((buffer[t] - 128) / 128) * ((buffer[t + k] - 128) / 128);
			}
			var r = sum / (n + k);
			if (r > bestR) { // if the correlation is better, set bestR and bestK
				bestR = r;
				bestK = k;
			}
			if (r > 0.9) break;
    }

	if (bestR > 0.0025) {         // if high enough correlation
		return sampleRate / bestK;  // get the fundamental freq from the period
	} else {
		return -1;
	}
}


var frameId;
function detectPitch(analyser) {
	var buffer = new Uint8Array(analyser.fftSize);
	analyser.getByteTimeDomainData(buffer);
	var fundalmentalFreq = findFundamentalFreq(buffer, audioContext.sampleRate);

	if (fundalmentalFreq !== -1) {
		var note = findClosestNote(fundalmentalFreq, notesArray); // See the 'Finding the right note' section.
		var cents = findCentsOffPitch(fundalmentalFreq, note.frequency); // See the 'Calculating the cents off pitch' section.
		updateNote(note.note); // Function that updates the note on the page (see demo source code).
		updateCents(cents); // Function that updates the cents on the page and the gauge control (see demo source code).
	}
	else {
		updateNote('--');
		updateCents(-50);
	}

	frameId = window.requestAnimationFrame(detectPitch);
}

export default {
  detectPitch: detectPitch
}
