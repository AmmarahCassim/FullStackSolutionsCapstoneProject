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