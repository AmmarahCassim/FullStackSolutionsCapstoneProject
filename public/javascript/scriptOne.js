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
var text = '';  //this is what i am using to pass for the sign language function to read the text generated
                //So when an edit is made please make sure that this text is also edited so that its corrected for the sign language

var wordsForSignLanguage;

	


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
      $(".edit").append("<img src='../NewGIF.gif' alt='loading icon' width='50px'/>");
      $.get("/text", function(data, status){      
        console.log("I AM WORKING");
        
      })
      .done(function(data){ //here is where the text variable begins being used!!!!!!!!!!
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
          text += '';
          text = text.replace(/,/g," ");
          console.log("WHAT IS THE TEXT VARIABLE");
          console.log(text);
          $(".leftEdit>p").text(text);
          $(".export").removeClass("disabledElement");
          setTimeout(addPhonemes,500);
          //addPhonemes();
        });
      });
    });

/* this will be called once speech to text returns its data*/
function addPhonemes(){
  console.log("adding phonemes");
  $.get("/wordTimings",function(data, status){
      wordsForSignLanguage=data[0];
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

$(document).on('click','.EXPORT',function(e) {
        filename = $("#filename").val();
       // alert("exporting file now")
        console.log("exporting file now",filename);
        // $.ajax({
        //   method: "POST",
        //   url:"/pidginbreakdown",
        //   data: {file: filename}
        // }).done(function(){
          
        //   console.log("file has been exported");
        // }); 
        window.open('/pidginbreakdown?filename='+filename);
  });

    /*------------------------------------------------SIGN LANGUAGE -------------------------------------------------------*/
    //this is where i take the text variable exactly when its generated
    $(document).on('click','.SIGN',function() {
        var signsArray = new Array();

        signsArray[0] = "../Letters/A.png";
        signsArray[1] = "../Letters/B.png";
        signsArray[2] = "../Letters/C.png";
        signsArray[3] = "../Letters/D.png";
        signsArray[4] = "../Letters/E.png";
        signsArray[5] = "../Letters/F.png";
        signsArray[6] = "../Letters/G.png";
        signsArray[7] = "../Letters/H.png";
        signsArray[8] = "../Letters/I.png";
        signsArray[9] = "../Letters/J.png";
        signsArray[10] = "../Letters/K.png";
        signsArray[11] = "../Letters/L.png"
        signsArray[12] = "../Letters/M.png";
        signsArray[13] = "../Letters/N.png";
        signsArray[14] = "../Letters/O.png";
        signsArray[15] = "../Letters/P.png";
        signsArray[16] = "../Letters/Q.png";
        signsArray[17] = "../Letters/R.png";
        signsArray[18] = "../Letters/S.png";
        signsArray[19] = "../Letters/T.png";
        signsArray[20] = "../Letters/U.png";
        signsArray[21] = "../Letters/V.png";
        signsArray[22] = "../Letters/W.png";
        signsArray[23] = "../Letters/X.png";
        signsArray[24] = "../Letters/Y.png";
        signsArray[25] = "../Letters/Z.png";
        signsArray[26] = "../Letters/space.png";

        var wordtext=text.toLowerCase(); //this is where i convert  the text into lower case so make sure the text when you edit is
                                        // always up to date so that the sign language function is aswell
        //console.log("SIGN: "+wordtext);
        for (var i = 0; i < text.length; i++) {
            if (wordtext.charAt(i) != ' ') {
                //if it aint a space then its a letter
                if (wordtext.charAt(i) == 'a') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[0] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'b') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[1] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'c') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[2] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'd') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[3] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'e') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[4] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'f') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[5] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'g') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[6] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'h') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[7] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'i') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[8] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'j') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[9] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'k') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[10] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'l') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[11] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'm') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[12] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'n') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[13] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'o') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[14] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'p') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[15] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'q') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[16] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'r') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[17] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 's') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[18] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 't') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[19] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'u') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[20] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'v') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[21] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'w') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[22] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'x') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[23] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'y') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[24] + "' width='160' height='120'/>";
                }
                if (wordtext.charAt(i) == 'z') {
                    document.getElementById("postSigns").innerHTML += "<img src='" + signsArray[25] + "' width='160' height='120'/>";
                }
            }
            else {
                //this adds the blank space
                document.getElementById("postSigns").innerHTML += "<img class='w3-panel w3-border w3-round-small w3-border-black' src='" + signsArray[26] + "' width='100' height='25'/>";
            }
        }
    });
//---------------------------------------------------------------//
    
});


