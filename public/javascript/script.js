    $(document).ready(function(){
      console.log("hello from script");
       $('input[type="file"]').change(function(e){
    console.log("changed");
      var fileName = e.target.files[0].name;
      $("#file-upload-filename").text(fileName);
      $("#Submitter").removeAttr("disabled");
  });
      
    $("#generate").click(function(e){  
      console.log("generating");
      $.get("/text", function(data, status){
       // alert('found SCRIPT');
        console.log("I AM WORKING");
        $("textarea").append(data); 

      })
      .done(function(){
        
        $("textarea").append(data); 
        alert("callback bi***es");
      })
    });

   


    

    $("#EXPORT").click(function(){
      $.get("/pidgin_breakdown", function(data, status){
          console.log("Data: " + data + "\nStatus: " + status);
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
