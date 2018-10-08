$(document).ready(function(){
    $(document).on("change",'input[type="file"]',function(e){
        console.log("changed");
        var fileName = e.target.files[0].name;
        $("#file-upload-filename").text(fileName);
        $("#Submitter").removeAttr("disabled");
    });

    console.log("dropzone config loading");

    new Dropzone(document.body,{

        url:"/upload",
        previewsContainer: "#file-upload-filename",
        clickable:false,
        init:function(){
            console.log("dropzone is initialized");
            this.on("dragover", function() {
                console.log("dragging");
                $('.dragndrop').css("background-color","#c4c4c4");
                $('.timeline').css("background-color","#c4c4c4");
            });
            this.on("dragstart", function() {
                console.log("dragging");
            });
            this.on("dragenter", function() {
                console.log("dragging");
            });
            this.on("dragleave", function() {
                console.log("leaving drag are");
                $('.dragndrop').css("background-color","#EFEFEF");
                $('.timeline').css("background-color","#EFEFEF");
            });
            this.on("drop",function(){
                console.log("dropped file");
                $("#Submitter").removeAttr("disabled");
                $(".edit").empty();
                $(".edit").html('<button type="button" class="btn btn-primary" id="generate" data-step="1" data-intro="lets see what your sound file contains" data-tooltipclass="forLastStep">SPEECH TO TEXT</button>');
            });
            this.on("addedfile",function(){
                console.log("added file");
                $("#uploadForm").submit();

            });

        }


    });



    var filename;
    console.log("hello from script");
    $(document).on("change",'input[type="file"]',function(e){
        console.log("changed");
        var fileName = e.target.files[0].name;
        $("#file-upload-filename").text(fileName);
        //$("#Submitter").removeAttr("disabled");
    });

    //   $(document).on('click','.EXPORT',function(e) {
    //     //filename = $("#filename").val();
    //       alert("exporting file now")
    //       console.log("exporting file now");
    //       // $.ajax({
    //       //   method: "POST",
    //       //   url:"/pidginbreakdown",
    //       //   data: {file: filename}
    //       // }).done(function(){

    //       //   console.log("file has been exported");
    //       // });
    // });

    $("#EDIT").click(function(){
        console.log("heita");
        var text = $("#speechtotext").val();
        console.log(text);
        $.post("/update",{output: text},function(data,status){
            console.log("Data: " + data);
        });
    });


    var url = $(".modal-body>iframe").attr('src');

    /* Assign empty url value to the iframe src attribute when
    modal hide, which stop the video playing */
    $("#myModal").on('hide.bs.modal', function(){
        console.log("hide modal");
        console.log(url);
        $(".modal-body>iframe").attr('src', '');
    });

    /* Assign the initially stored url back to the iframe src
    attribute when modal is displayed again */
    $("#myModal").on('show.bs.modal', function(){
        $(".modal-body>iframe").attr('src', url);
    });

});

//------------------THIS IS WHERE I ADD THE MIC---------------------//

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

// var recordButton = document.getElementById("recordButton");
// var stopButton = document.getElementById("stopButton");
// var pauseButton = document.getElementById("pauseButton");

//add events to those 2 buttons
// recordButton.addEventListener("click", startRecording);
// stopButton.addEventListener("click", stopRecording);
// pauseButton.addEventListener("click", pauseRecording);
var value=0;
function startRecording() {
    console.log("recordButton clicked");
    //these two getElementID change the class names for the animations to take place
    document.getElementById('recordButton').classList.remove("notRec");
    document.getElementById('recordButton').classList.add("Rec");
    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
       Disable the record button until we get a success or fail from getUserMedia()
   */

    document.getElementById("recordButton").style.background='red';
    document.getElementById("recordButton").style.borderRadius='50px';

    document.getElementById("stopButton").style.opacity = '100';
    value=100;
    // pauseButton.disabled = false

    /*
        We're using the standard promise based getUserMedia()
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format
        document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /*
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        //document.getElementById("recordButton").disabled = false;
        document.getElementById("recordButton").style.background='none';
        //document.getElementById("stopButton").disabled = true;
        document.getElementById("stopButton").style.opacity = '0.1';
        value=0;
    });
}

function stopRecording () {
    document.getElementById('recordButton').classList.remove("Rec");
    document.getElementById('recordButton').classList.add("notRec");
    if (value == 100) {
        console.log("stopButton clicked");

        //disable the stop button, enable the record too allow for new recordings
        //document.getElementById("stopButton").disabled = true;
        document.getElementById("stopButton").style.opacity = '0.1';
        // document.getElementById("recordButton").disabled = false;
        document.getElementById("recordButton").style.background = 'none';
        //pauseButton.disabled = true;

        //reset button just in case the recording is stopped while paused
        //pauseButton.innerHTML="Pause";

        //tell the recorder to stop the recording
        rec.stop();

        //stop microphone access
        gumStream.getAudioTracks()[0].stop();

        //create the wav blob and pass it on to createDownloadLink
        rec.exportWAV(createDownloadLink);
        value = 1;
    }
    else {
        alert("Wont work");
    }
    return false;
}

function createDownloadLink(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    //name of .wav file to use during upload and download (without extendion)
    var filename ="Recorded";

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //save to disk link
    link.href = url;
    link.className="btn btn-primary";
    link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
    link.innerHTML = "Save to disk";


    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.appendChild(document.createTextNode(filename+".wav "))

    //add the save to disk link to li
    li.appendChild(link);

    //upload link
    var upload = document.createElement('BUTTON');
    upload.type="submit";
    upload.innerHTML = "Upload";
    upload.className="btn btn-primary";
    upload.addEventListener("click", function(event){
        var xhr=new XMLHttpRequest();
        xhr.onload=function(e) {
            if(this.readyState === 4) {
                console.log("Server returned: ",e.target.responseText);
            }
        };
        //i call the form that you created in the index.ejs file
        var form = document.getElementById('uploadForm');
        var fd = new FormData(form);
        fd.append("file",blob, filename);
        document.getElementById("Submitter").disabled=false;
        xhr.open("POST","/upload",true);
        xhr.send(fd);

    })
    li.appendChild(document.createTextNode (" "))//add a space in between
    li.appendChild(upload)//add the upload link to li
    document.getElementById("Submitter").disabled=false;
    //add the li element to the ol
    recordingsList.appendChild(li); //this adds it to the list

}







