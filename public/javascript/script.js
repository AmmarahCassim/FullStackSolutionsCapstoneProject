    var wavesurfer = null;
    
    var play = function()
    {
        wavesurfer.play();
    }

    var prepare = function()
    {
        wavesurfer = WaveSurfer.create({
            container: ".js-waveform",
            backend: 'MediaElement'
            
        });

        wavesurfer.load('letsparty.wav');
    }();