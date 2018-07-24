$(document).ready(function(){

  //--------Upload Button Validation
  // $('input:file').change(
  //     function(){
  //         if ($(this).val()) {
  //             //$('input:submit').attr('disabled',false);
  //             // or, as has been pointed out elsewhere:
  //              $('input:submit').re 
  //         } 
  //     }
  //     );
  //   });

  //--------Audio Form Validation:
  // var input = document.querySelector('input');
  // var preview = document.querySelector('.preview');

  // input.style.opacity = 0;
  // input.addEventListener('change', updateAudio);

  // function updateAudio(){
  //   while(preview.firstChild){
  //     preview.removeChild(preview.firstChild);
  //   }
  //   alert("testes");
  //   var curFiles = input.files;
  //   if(curFiles.length === 0){
  //     var para = document.createElement('p');
  //     para.textContent = "No file selected for upload.";
  //     preview.appendChild(para);
  //   } 
  //   else{
  //     var list = document.createElement('ol');
  //     preview.appendChild(list);
  //     for(var i = 0; i < curFiles.length; i++){
  //       var listItem = document.createElement('li');
  //       var para = document.createElement('p');
  //       if(validFileType(curFiles[i])){
  //         para.textContent = 'File name: ' + curFiles[i].name + ' (' + returnFileSize(curFiles[i].size) + ').';
  //         listItem.appendChild(para);
  //       }
  //       else{
  //         para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type! File must be a .WAV';
  //         listItem.appendChild(para);  
  //       }

  //       listItem.appendChild(para);
  //     }
  //   }
  // }

  // var fileTypes = ['audio/wav'];

  // function validFileType(file_){
  //   for(var i=0; i < fileTypes.length; i++){
  //     if(file_.type === fileTypes[i]){
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // function returnFileSize(number){
  //   if(number < 1024){
  //     return number + 'bytes';
  //   }
  //   else if( number >= 1024 && number < 1048576){
  //     return(number/1024).toFixed(1) + 'KB';
  //   }
  //   else if(number >= 1048576){
  //     return(number/1048576).toFixed(1) + 'MB';
  //   }
  // }
  //------------------------------

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

  // $(".about").click(function(){
  //   alert("Mase");
  //   $("#about_popUp").fadeToggle();
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