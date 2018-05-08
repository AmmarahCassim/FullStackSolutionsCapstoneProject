$("#generate").click(function(e){  
      $.get("/text", function(data, status){
       // alert('found SCRIPT');
        console.log("I AM WORKING");
        $("textarea").append(data); 

      })
      .done(function(){
        
        $("textarea").append(data); 
        alert("callback bitches");
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

    var myIndex = 0;
    carousel();
    
    function carousel() {
        var i;
        var x = document.getElementsByClassName("slides");
        for (i = 0; i < x.length; i++) {
           x[i].style.display = "none";  
        }
        myIndex++;
        if (myIndex > x.length) {myIndex = 1}    
        x[myIndex-1].style.display = "block";  
        setTimeout(carousel, 300);
    }