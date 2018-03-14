 var wavesurfer = null;
    function addButton(){
		document.getElementById("browser").remove();
		var button = document.createElement("button");
		button.className = "btn btn-dark";
		button.innerHTML ="play";
		document.getElementById('player').appendChild(button);
		button.addEventListener ("click", function() {
 			 play();
			});
    }
   /* var play = function()
    {
        wavesurfer.play();
    }

    var prepare = function()
    {
        wavesurfer = WaveSurfer.create({
            container: ".js-waveform",
            backend: 'MediaElement'
            
        });

        /*wavesurfer.on('ready', function () {
            wavesurfer.play();
        });

        wavesurfer.load('/letsparty.wav');
    }();*/