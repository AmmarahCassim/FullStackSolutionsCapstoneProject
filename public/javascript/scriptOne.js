$(document).ready(function(){
	console.log("working");
var words;
var phonemes;
var index =0;
var mouthValue;
var myIndex = 0;
var timeouter;
var i;
var y;
var x;
var flag= true;
var rangeSplitter =0;
var text = '" ';


	


  console.log("hello");
  var sliderBool = true;
  $(".dragndrop").remove();
  $("#addWave").animate({height:"45vh"});
  $("#second_row").attr("style","initial");	
  
  $(".dropdown").on("click",function(){
    $(".topRIGHT>img").css("opacity,0,2");
  });	
  $(".export").click(function(){
      var n = $(".edit").outerWidth();
      console.log("you clicked me speech length: ",n);
      //n += $(this).width();
      if(sliderBool){
      $(".edit").empty();
      $(this).animate({
        left:-n
      },500,function(){
        $.get("templates/export.html", function(data){
            $(".edit").append(data);
            $(".edit").css("line-height","normal");
        });
        $(".export>h2").text("EDIT");
        sliderBool = false;
      });
    }else{
      $(".edit").empty();
      $(this).animate({
        left:"-8%"
      },500,function(){

        $(".export>h2").text("EXPORT");
        $.get("templates/edit.html", function(data){
            $(".edit").html(data);
            $(".edit").css("line-height","normal");
            $(".leftEdit>p").text(text);
        });
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
        //wavesurfer.load("audio");  //get(audio/:filename)
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


  $("#generate").click(function(e){  
      console.log("generating");
      $(".edit").empty();
      $(".edit").append("<img src='../NewGIF.gif' alt='loading icon' width='50px'></img>");
      $.get("/text", function(data, status){      
        console.log("I AM WORKING");
        
      })
      .done(function(data){
        $(".edit").empty();
        text += data;
        
        //$(".edit").append(data); 

        $.get("templates/edit.html", function(data){
            $(".edit").empty();
            $(".edit").append(data);
            //$(".editContent>p").text(data);
            $(".edit").css("line-height","normal");
        })
        .done(function(){
          text += ' "';
          text = text.replace(/,/g," ");
          console.log("WHAT IS THE TEXT VARIABLE");
          console.log(typeof text);
          $(".leftEdit>p").text(text);
          $(".export").removeClass("disabledElement");
          setTimeout(addPhonemes,500);
          //addPhonemes();
        });
      });
    });
/* this whill be called once speech to text returns its data*/
function addPhonemes(){
  console.log("adding phonemes");
  $.get("/wordTimings",function(data, status){
          words = JSON.parse(data[0]);
          phonemes = data[1];
          console.log(phonemes);
          console.log(words);

          //for(int i =0; i < words.timestamps[0].length; ++i){
            console.log(words.length);
            for(var i =0; i < words.length;++i){
            // this is the blue region which contains the words from the sound file
                wavesurfer.addRegion({
                  start: words[i][1],
                  end: words[i][2],
                  color: 'hsla(42,42%,32%,0.3)',
                  id: "top",
                  attributes: {
                    label: words[i][0]
                  }
                });
             // for(var j = 0; j < words[i].length;++j){
                console.log(words[i][0]);

              
              console.log(" ");
            }
       // this is the black region at the bottom. with the phonemes
            for(var i =0; i < words.length;++i){
              rangeSplitter = words[i][2] - words[i][1];
              rangeSplitter = rangeSplitter / words[i][0].length;
              for(var j  =0; j < words[i][0].length ; ++j){ 
                wavesurfer.addRegion({
                  start: words[i][1],
                  end: words[i][1] += rangeSplitter,
                  color: 'hsla(42,42%,32%,0.3)',
                  id: "bottom",
                  attributes: {
                    label: phonemes[index][0]
                  }
                });
                ++index;
             // for(var j = 0; j < words[i].length;++j){
             }
                console.log(words[i][0]);

              
              console.log(" ");
            }
      

          //alert("data: " + words);
        });
  }
/* when the user clicks play the carousel starts to spin*/
  $("#PLAY").on('click',function(){
    console.log("heya");
    //var clicks = $(this).data('clicks');
    if (flag) {
    /** calls carousel function*/
    //we use setinterval to control the speed at which the image changes
     timeouter = setInterval(carousel, 300);
     flag = false;
    } else {
     clearTimeout(timeouter);
     flag = true;
  }
  //$(this).data("clicks", !clicks);
    
  });  
    
    function carousel() {
        x = document.getElementsByClassName("slides");
        for (i = 0; i < x.length; i++) {
           //x[i].style.display = "none"; 
           x[i].classList.add('active'); 
        }
        y = document.getElementsByClassName("active");
        for (i = 0; i < x.length; i++) {
           x[i].style.display = "none"; 
        }
        myIndex++;
        if (myIndex > x.length) {myIndex = 1}    
        x[myIndex-1].style.display = "inline";  
        //setInterval(carousel, 300);
    }


$(document).on("click",".dropdown-menu>li>a",function(){
  console.log("clicked dropdown link");
  mouthValue = $(this).attr("id");
  $.ajax({
    method: "GET",
    url:"/load_images",
    data: {mouth: mouthValue}
  }).done(function(msg){
    console.log(msg);
    $(".slides").remove();
    $("#mouths").append(msg);
  });
});

/*------------------------------------------------DRAG AND DROP -----------------------------------*/

 


    
});


