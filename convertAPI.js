var http = require("http");
const express = require('express');
const app = express();

var options = {
    "method": "POST",
    "hostname": "api2.online-convert.com",
    "port": null,
    "path": "/jobs",
    "headers": {
        "x-oc-api-key": "2df488a79800c05c1a8c45bb29c93b5b",	//Inserted API key here
        "content-type": "application/json",
        "cache-control": "no-cache"
    }
};

// app.post{
		// console.log("hello")
// });
app.get('/test',function(requ,resu){
		var req = http.request(options, function (res) {
		var chunks = [];

		res.on("data", function (chunk) {
			console.log(chunk);
			chunks.push(chunk);
		});
		
		res.on('error',function(err){
			res.json(err);
		});
		
		res.on("end", function () {
			var body = Buffer.concat(chunks);
			console.log(body.toString());
			var obj= JSON.parse(body.toString());
			console.log("HEre");
			//if(obj.status.code=='completed')
				resu.json(JSON.parse(body.toString()));
		});
	});
	req.write(JSON.stringify({
		input: [{
			type:'remote',
			source: 'https://static.online-convert.com/example-file/raster%20image/jpg/example_small.jpg'
		}],
		conversion:[{ 
			category:'image',
			target: 'png'
		}]
	}));
	req.end();
});

app.listen(5000);

//http://localhost:5000/test