$(document).ready(function(){
var $form = $('.dragndrop');
var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

if (isAdvancedUpload) {
  console.log(isAdvancedUpload);


 var droppedFiles = false;

  $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    console.log("dragging");
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function() {
    $form.addClass('is-dragover');
  })
  .on('dragleave dragend drop', function() {
    $form.removeClass('is-dragover');
  })
  .on('drop', function(e) {
    droppedFiles = e.originalEvent.dataTransfer.files;
    $("#file-upload-filename").text(droppedFiles[0]["name"]);
    console.log(droppedFiles[0]["name"]);
    
    handleFileUpload(droppedFiles);

  });

}


function handleFileUpload(files)
{
          
        sendFileToServer(files[0]);
 
}

function sendFileToServer(formData){

  $.ajax({
    url: '/upload',
    type: 'POST',
    data: formData,
    dataType: 'json',
    cache: false,
    contentType: false,
    processData: false,
    complete: function() {
      console.log("uploading");
      //if the file has uploaded successfully we can turn off required
        $("#files").prop('required', false);
      //This then makes the upload file available for us to use.
        $("#Submitter").prop('disabled', false);
    },
    success: function() {
      console.log("cat");
    },
    error: function() {
      // Log the error, show an alert, whatever works for you
    }
  });
}


  var filename;
      console.log("hello from script");
       $(document).on("change",'input[type="file"]',function(e){
    console.log("changed");
      var fileName = e.target.files[0].name;
      $("#file-upload-filename").text(fileName);
      $("#Submitter").removeAttr("disabled");
  });
  
    $(document).on('click','.EXPORT',function(e) {
      filename = $("#filename").val();
        console.log("exporting file now");
        $.ajax({
          method: "POST",
          url:"/pidgin_breakdown",
          data: {file: filename}
        }).done(function(){
          
          console.log("file has been exported");
        }); 
  });

    $("#EDIT").click(function(){
      console.log("heita");
      var text = $("#speechtotext").val();
      console.log(text);
      $.post("/update",{output: text},function(data,status){
        console.log("Data: " + data);
      });  
    });
    

  

    
});
