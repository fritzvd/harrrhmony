'use strict';

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

var signaltohertz = require('signaltohertz');
var harrrhmony = require('./harrrhmony');
var io = require('socket.io-client');

var audio, volume, frequencies, frequency, audioContext, analyser, 
    microphone, waveform, amplitude, recorder;


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
    //renderFrame();
  };

var errorcb = function (error) {
    console.log('Did not work', error)  
  };

navigator.getUserMedia(
  {audio: true, video: false},
  streamingcb,
  errorcb);

var recording = [];
var timer;

function record () {
  while (timer > 0)  {
    console.log(timer);
    var renderFrame = function () {
      timer--;
      setTimeout(requestAnimationFrame(renderFrame), 100);
      analyser.getFloatFrequencyData(frequencies);
      analyser.getByteFrequencyData(amplitude);
      recording.push(amplitude);
      // console.log(amplitude)

      frequency = signaltohertz(frequencies);
          if (frequency > 20) {
          var note = harrrhmony(frequency);

            document.querySelector('#mynote').innerHTML = note.note.note.toString();

          }
    };
  };
  socket.emit('recording', recording);
};

var socket = io.connect();
socket.on('notmyrecording', function (message) {
  console.log('message was: ', message);
});

var form = document.querySelector('form');
form.onsubmit = function (e) {
  e.preventDefault();
  timer = 20;
  record();
};
