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
var otherRecording = [];
var timer;

var renderFrame = function () {
  timer--;
  analyser.getFloatFrequencyData(frequencies);
  analyser.getByteFrequencyData(amplitude);
  recording.push(amplitude);

  frequency = signaltohertz(frequencies);
      if (frequency > 20) {
      var note = harrrhmony(frequency);

        document.querySelector('#mynote').innerHTML = note.note.note.toString();

      }
  if (timer > 0) {
    requestAnimationFrame(renderFrame);
  } else {
    socket.emit('recording', recording);
  }
};

var socket = io.connect();

var me;

socket.on('welcome', function (newPeople) {
  me = newPeople;
});

socket.on('recording', function (message) {
  console.log('message was: ', message);
  if (message.sender !== me) {
    otherRecording = message.recording;
    playOther();
  }
});

var form = document.querySelector('form');
form.onsubmit = function (e) {
  e.preventDefault();
  timer = 20;
  recording = [];
  renderFrame();
};

var buildOtherCtx = function () {
  otherCtx = new AudioContext();
};

var otherCtx, buf;
var playOther = function () {
  if (!otherCtx) {
    buildOtherCtx();
  };

  otherCtx.decodeAudioData(otherRecording, function (buffer) {
    buf = buffer;
    play();
  });
};

var play = function () {
  var source = otherCtx.createBufferSource();
  source.buffer = buf;
  source.connect(context.destination);
  source.start(0);
};


