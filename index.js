'use strict';

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;




var letterSize = function () {
  console.log('i have been here')
  var el = document.getElementById('note');
  el.style = "font-size: " + window.innerHeight * 0.8 + 'px';
}

window.onresize = letterSize;
document.onreadystatechange = letterSize;

var signaltohertz = require('signaltohertz');
var harrrhmony = require('./harrrhmony');

var audio, volume, frequencies, frequency, audioContext, analyser, 
    microphone, waveform, amplitude;


var streamingcb =  function (stream) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    frequencies = new Float32Array(analyser.frequencyBinCount);
    console.log(analyser)
    amplitude = new Uint8Array(analyser.frequencyBinCount);

    volume = audioContext.createGain();

    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(volume);
    microphone.connect(analyser);

    renderFrame();
  };

var errorcb = function (error) {
    console.log('Did not work', error)
  };

navigator.getUserMedia(
  {audio: true, video: false},
  streamingcb,
  errorcb);


function renderFrame () {
  setTimeout(requestAnimationFrame(renderFrame), 100);
  analyser.getFloatFrequencyData(frequencies);
  analyser.getByteTimeDomainData(amplitude);

  frequency = signaltohertz(frequencies);
    //   document.querySelector('#max').innerHTML = max ;
    // document.querySelector('#index').innerHTML = frequency  + '    Hz';
      if (frequency > 20) {
      var note = harrrhmony(frequency);
        document.querySelector('#note').innerHTML = note.note.note.toString();

      }
};
