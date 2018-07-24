var words;
var phonemes;
var index =0;
var rangeSplitter =0;
var wavesurfer = WaveSurfer.create({ 
          container: '#addWave',
          pixelRatio: 1,
          barWidth: 2,
          progressColor: "#333333",
          backend: 'MediaElement',
          mediaType: 'audio',
          hideScrollbar: 'true'
          });

        wavesurfer.load("audio"); //get(audio/:filename)
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
          
          //wavesurfer.setPlaybackRate(0.5);
          alert("PLAYING");
          wavesurfer.playPause();

          $('#play_btn').find('span').toggleClass('fas fa-play').toggleClass('glyphicon-pause');

        }


        //$(".form-inline").hide('slow', function(){ $(".form-inline").remove(); });
        $(".form-inline").css({
                            'position': 'absolute',
                            'bottom': '0px',
                             'left' : '21px'
        });
        var r= $('<button id ="play_btn" type="button" class="btn btn-info" value ="what" style=" position: absolute; bottom: 10px; right: 21px;" onclick="playSound()">fucking play</button>'); 
        $('#addWave').append(r);

         
        $("#breakdown").click(function(){
        $.get("/wordTimings",function(data, status){
          words = JSON.parse(data[0]);
          phonemes = data[1];

          //for(int i =0; i < words.timestamps[0].length; ++i){
            console.log(words.length);
            for(var i =0; i < words.length;++i){

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
      });
$(document).ready(function(){
  var mouthValue;
$("#play_btn").click(function(){
  console.log("hello");

});
$(".dropdown-menu>li>a").click(function(){
  mouthValue = $(this).attr("id");
  $.ajax({
    method: "GET",
    url:"/load_images",
    data: {mouth: mouthValue}
  }).done(function(){
    
    $(".slides").remove();
}).always(function(msg) {
     //console.log(msg);
        $(".topRight").append(msg);
        carousel();  
});
});
$("#play_btn").on('click',function(){
  console.log("playing");
});

});