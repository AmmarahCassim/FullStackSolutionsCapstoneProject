$(document).ready(function(){

  console.log("hello");
  var sliderBool = true;
  $(".dragndrop").remove();

  $(".export").click(function(){
      var n = $(".edit").outerWidth();
      console.log("you clicked me speech length: ",n);
      //n += $(this).width();
      if(sliderBool){
      $(".edit").empty();
      $(this).animate({
        left:-n
      },500,function(){

        $(".export>h2").text("EDIT");
        sliderBool = false;
      });
    }else{
      $(".edit").empty();
      $(this).animate({
        left:"-8%"
      },500,function(){

        $(".export>h2").text("EXPORT");
        $(".edit").append("<button type='button' class='btn btn-primary'>SPEECH TO TEXT</button>");
        sliderBool = true;
      });

    }
    });

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