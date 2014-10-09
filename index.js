'use strict';

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;


var signaltohertz = require('signaltohertz');
var harrrhmony = require('./harrrhmony');
var Webrtc = require('simplewebrtc');

var audio, volume, frequencies, frequency, audioContext, analyser, 
    microphone, waveform, amplitude;


var streamingcb =  function (stream) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    frequencies = new Float32Array(analyser.frequencyBinCount);
    amplitude = new Uint8Array(analyser.frequencyBinCount);

    volume = audioContext.createGain();

    microphone = audioContext.createMediaElementSource(el);
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
  console.log(frequency)
  // console.log('yahoozie', frequency,  document.querySelector('#mine'));
    //   document.querySelector('#max').innerHTML = max ;
    // document.querySelector('#index').innerHTML = frequency  + '    Hz';
      if (frequency > 20) {
      var note = harrrhmony(frequency);

        document.querySelector('#mynote').innerHTML = note.note.note.toString();

      }
};





// var webrtc = new Webrtc({
//     // the id/element dom element that will hold "our" video
//     localVideoEl: 'mine',
//     // the id/element dom element that will hold remote videos
//     remoteVideosEl: 'yours',
//     // immediately ask for camera access
//     autoRequestMedia: true,
//     media: {
//       video: false,
//       audio: true
//     },
//     url: 'http://localhost:8888'
// });

// var audioM = document.querySelector("#mine");
 

// webrtc.on('localStream', function () {
//   setTimeout(function () {
//     streamingcb(audioM.children[0]);
//     window.analyser = analyser
//   }, 300);
// });

// webrtc.on('peerStreamAdded', function () {

// })
  

// // we have to wait until it's ready
// webrtc.on('readyToCall', function () {
//   // you can name it anything
//   webrtc.joinRoom('fritzio');
// });

