'use strict';

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;


var signaltohertz = require('signaltohertz');
var harrrhmony = require('./harrrhmony');
var socket = require('socket.io-client');

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
  analyser.getByteFrequencyData(amplitude);

  // console.log(amplitude)

  frequency = signaltohertz(frequencies);
      if (frequency > 20) {
      var note = harrrhmony(frequency);

        document.querySelector('#mynote').innerHTML = note.note.note.toString();

      }
};

var pc = new PeerConnection(['localhost:5000'], {
  iceServers: [{ url: "stun:localhost:5000"}]
});

window.pc = pc;

var dataChannel = pc.createDataChannel("harrrhmony", {
  ordered: false, // do not guarantee order
  maxRetransmitTime: 3000, // in milliseconds
});

dataChannel.onmessage = function (event) {
  console.log(event.data);
};

dataChannel.onopen = function () {
  console.log('we are a ago')
}

dataChannel.onclose = function () {
  console.log('closed');
}


var form = document.querySelector('form');
form.onsubmit = function (e) {
  e.preventDefault();
  // message.prop('disabled', true);
  dataChannel.send({
    massa: 'this is a test'
  });
} ;
