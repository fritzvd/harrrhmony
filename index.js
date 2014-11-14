'use strict';


navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

var signaltohertz = require('signaltohertz');
var harrrhmony = require('./harrrhmony');
var io = require('socket.io-client');

var recordingLength = 100;

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
var otherRecording;
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
  } else {
  window.recording = recording;
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
    otherRecording = new ArrayBuffer(recordingLength);
    message.recording.forEach(function (arr, i) {
      otherRecording[i] = arr;
    });
    playOther();
  }
});

var form = document.querySelector('form');
form.onsubmit = function (e) {
  e.preventDefault();
  timer = recordingLength;
  recording = [];
  renderFrame();
};

var buildOtherCtx = function () {
  otherCtx = new AudioContext();
  source = otherCtx.createBufferSource();
};

var request;
function getData() {
  var audioCtx = otherCtx;
  source = audioCtx.createBufferSource();
  request = new XMLHttpRequest();

  request.open('GET', 'letmego.wav', true);

  request.responseType = 'arraybuffer';


  request.onload = function() {
    var audioData = request.response;

    audioCtx.decodeAudioData(audioData, function(buffer) {
      source.buffer = buffer;

      source.connect(audioCtx.destination);
      source.loop = true;
    },

    function(e){"Error with decoding audio data" + e.err});

  }

  request.send();
  return source;
}


var otherCtx, buf, source;
var playOther = function () {
  if (!otherCtx) {
    console.log('yoohoo', otherCtx);
    buildOtherCtx();
  };

  getData();

    console.log('yoohoo', otherRecording);
  otherCtx.decodeAudioData(otherRecording, function (buffer) {
    buf = buffer;
  console.log('sdfasdfasdfsa')
    play();
  });
};

var button = document.getElementById('clickMe');

var onClick = function (e) {
  buildOtherCtx();
  console.log('asdfasdfa');
  var source = getData();
  source.start(0);
};
button.addEventListener('click', onClick);

var play = function () {
  var source = otherCtx.createBufferSource();
  source.buffer = buf;
  console.log('sdfasdfasdfsa')
  source.connect(otherCtx.destination);
  source.start(0);
};


