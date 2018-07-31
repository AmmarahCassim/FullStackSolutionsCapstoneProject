// console.log("dropzone config loading");
// Dropzone.options.uploadForm = {
//   paramName: "file", // The name that will be used to transfer the file
//   maxFilesize: 2, // MB
//   init:function(){
//   	console.log("dropzone is initialized");
//   	this.on("dragover", function() { console.log("dragging"); });
//   	this.on("dragstart", function() { console.log("dragging"); });
//   	this.on("dragenter", function() { console.log("dragging"); });
//   	this.on("dragleave", function() { console.log("dragging"); });
//   }
// };


$(document).ready(function(){
$(document).on("change",'input[type="file"]',function(e){
    console.log("changed");
      var fileName = e.target.files[0].name;
      $("#file-upload-filename").text(fileName);
      $("#Submitter").removeAttr("disabled");
  });

console.log("dropzone config loading");
Dropzone.options.uploadForm = {
  paramName: "file", // The name that will be used to transfer the file
  maxFilesize: 2, // MB
  init:function(){
  	console.log("dropzone is initialized");
  	this.on("dragover", function() { 
      console.log("dragging"); 
    });
    this.on("dragstart", function() { 
      console.log("dragging"); 
    });
    this.on("dragenter", function() { 
      console.log("dragging"); 
    });
    this.on("drop",function(){
      console.log("dropped file");
          $("#Submitter").removeAttr("disabled");
    });
    this.on("addedfile",function(){
      console.log("added file");
          $("#Submitter").removeAttr("disabled");
    });

  }
};

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