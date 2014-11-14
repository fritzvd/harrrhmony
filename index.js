'use strict';


navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

var signaltohertz = require('signaltohertz');
var harrrhmony = require('./harrrhmony');

var audio, volume, frequencies, frequency, audioContext, analyser, 
    microphone, waveform, amplitude, recorder, songCtx, source;

songCtx = new AudioContext();
source = songCtx.createBufferSource();




var streamingcb =  function (stream) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    frequencies = new Float32Array(analyser.frequencyBinCount);
    amplitude = new Uint8Array(analyser.frequencyBinCount);

    volume = audioContext.createGain();

    microphone = audioContext.createMediaStreamSource (stream);
    microphone.connect(volume);
    microphone.connect(analyser);
    window.microphone = microphone
  };

var errorcb = function (error) {
    console.log('Did not work', error)  
  };

navigator.getUserMedia({
    audio: true,
    video: false
  },
  streamingcb,
  errorcb);

var recording = [];
var timer;

var renderFrame = function () {
  timer--;
  analyser.getFloatFrequencyData(frequencies);
  analyser.getByteFrequencyData(amplitude);
  recording.push(frequencies);

  frequency = signaltohertz(frequencies);
      if (frequency > 20) {
      var note = harrrhmony(frequency);

        document.querySelector('#mynote').innerHTML = note.note.note.toString();

      }
  if (timer > 0) {
    requestAnimationFrame(renderFrame);
  } 
};


var request;
function getData() {
  request = new XMLHttpRequest();

  request.open('GET', 'letmego.wav', true);

  request.responseType = 'arraybuffer';


  request.onload = function() {
    var audioData = request.response;

    songCtx.decodeAudioData(audioData, function(buffer) {
      source.buffer = buffer;

      source.connect(songCtx.destination);
      source.loop = true;
    },

    function(e){"Error with decoding audio data" + e.err});

  }

  request.send();
  return source;
}


var button = document.getElementById('clickMe');

var onClick = function (e) {
  getData();
  source.start(0);
};
button.addEventListener('click', onClick);


