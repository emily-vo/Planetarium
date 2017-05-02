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
        if (buffer[t] && buffer[t+k]) {
		      sum += ((buffer[t] - 128) / 128) * ((buffer[t + k] - 128) / 128);
        }
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


export default {
  findFundamentalFreq: findFundamentalFreq
}
