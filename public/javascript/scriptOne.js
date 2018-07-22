$(document).ready(function(){
  console.log("hello");
  $(".dragndrop").remove();

var wavesurfer = WaveSurfer.create({ 
          container: '#addWave',
          pixelRatio: 1,
          barWidth: 2,
          progressColor: "#333333",
          backend: 'MediaElement',
          mediaType: 'audio',
          hideScrollbar: 'true'
          });

        wavesurfer.load("audio");
        wavesurfer.load("audio");  //get(audio/:filename)
        $("#addWave-timeline").css("display","inline");
        wavesurfer.on('ready', function () {

          var timeline = Object.create(WaveSurfer.Timeline);
          timeline.init({
          wavesurfer: wavesurfer,
          container: '#addWave-timeline'
          });

        });
        wavesurfer.load("audio");

        function playSound(){
    
          wavesurfer.playPause();

        }
        var r= $('<button id ="PLAY" type="button" class="btn btn-info" value ="PLAY"style=" position: absolute; bottom: 10px; right: 21px;" onclick="playSound()">play</span></button>'); 
        $('#addWave').append(r);

        $("#PLAY").on("click",function(){
          console.log("play");
          playSound();
        });
});