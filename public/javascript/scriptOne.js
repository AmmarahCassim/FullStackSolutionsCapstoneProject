$(document).ready(function(){

  console.log("hello");
  var sliderBool = true;
  $(".dragndrop").remove();

 // $("#files").click(function(){
		$("#addWave").animate({height:"45vh"});
		$("#second_row").attr("style","initial");
//	});
			
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
  
  // $(".btn-file").click(function(){
  //   alert("fuuu");
  //   $("#Submitter").css("display","none");
  // });


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

        function pauseSound(){
          wavesurfer.pause();
        }

        function stopSound(){
          wavesurfer.stop();
        }

        var r= $('<button id ="PLAY" type="button" class="btn btn-info" value ="Play" onclick="playSound()"><i class="fas fa-play"></i></button><button id ="PAUSE" type="button" class="btn btn-info" value ="Pause" onclick="pauseSound()"><i class="fas fa-pause"></i></button><button id ="STOP" type="button" class="btn btn-info" value ="Pause" onclick="stopSound()"><i class="fas fa-stop"></i></button>'); 
        $('.timeline').append(r);

        $("#PLAY").on("click",function(){
          console.log("play");
          playSound();
        });

        $("#PAUSE").on("click",function(){
          console.log("pause");
          pauseSound();
        });

        $("#STOP").on("click",function(){
          console.log("pause");
          stopSound();
        });

        $.get("templates/form.html", function(data){
            $(".timeline").append(data);
        });
});