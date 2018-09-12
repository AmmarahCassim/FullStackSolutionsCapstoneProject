const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var mime = require('mime');
const mongoose = require('mongoose');
const multer = require('multer');
var PythonShell = require('python-shell');
const fs = require('fs');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
var watson = require('watson-developer-cloud');
var fname;
var outPut = "";
var fileUploaded = 0;
var userFileName;
var words = new Array();
var tempWords = new Array();
var temp;
var soundFile;
var fname;
var wordTimings;
var messageString;
var phonemeArray;
var newObject = [];
var difference;
var rangeSplit = 0;
var resposnseArray =[];
var fileNames = [];
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
//speech to text
var speech_to_text = new SpeechToTextV1 ({
  version: 'v1',
  "url": "https://stream.watsonplatform.net/speech-to-text/api",
    "username": "44237460-ece1-477e-8912-f6552e8495b0",
    "password": "TNmOa7lGouuS"
});

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Mongo URI
const mongoURI = 'mongodb://localhost/myDB';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;



conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
});
//const storage = require('multer-gridfs-storage');
const storage = new GridFsStorage({
  url:mongoURI,
  file: (req, file) => {
    // instead of an object a string is returned
    return 'file_' + Date.now();
  }
});

const upload = multer({ storage });

storage.on('file', function (file) {
  console.log('The file has been created',file['filename']);
  fname = file['filename'];
});

// @route GET /
// @desc Loads form
app.get('/', (req, res) => {
res.render('index', { files: false });
});

// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  res.render('index',{files:true});
});



app.get('/audio',(req, res) => {
  console.log('you hit the audio endpoint');
  gfs.files.findOne({ filename: fname}, (err, file) => {
    // Check if file
    //console.log("YO MA",userFileName);
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if audio
    if (file.contentType === 'audio/x-wav' ||  file.contentType === 'audio/wav') {
    //if(true){
      console.log(file.contentType);
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
      
      soundFile = file.filename;
      console.log(soundFile); //----this is it
      
        gfs.createReadStream(soundFile);

    } else {
      res.status(404).json({
        err: 'Not a sound file'
      });
    }

  });
});


app.get('/text',(req, res) =>{
    var object;
    var finalObject = new Array();
    var params = {
          audio: gfs.createReadStream(soundFile),
          content_type: 'audio/wav',
          timestamps: true,
          word_alternatives_threshold: 0.9,
          keywords: ['party', 'boys', 'lets'],
          keywords_threshold: 0.5
        }
        speech_to_text.recognize(params, function(error, transcript) {
        if (error){
          console.log('Error:', error);
        }
        else{
          words = [];
          for(var i =0; i < transcript.results.length;++i){
              outPut += transcript.results[0].alternatives[0].transcript;
             
          
            for(var j = 0; j < transcript.results[i].alternatives.length;++j){
              for (var k = 0; k < transcript.results[i].alternatives[j].timestamps.length; k++){
                words.push(transcript.results[i].alternatives[j].timestamps[k][0]);
                //wordTimings += transcript.results[i].alternatives[j].timestamps;
              }
            }
          }

          for(var i = 0; i <transcript.results.length;++i){
               for(var j = 0; j < transcript.results[i].alternatives.length;++j){
                 for (var k = 0; k < transcript.results[i].alternatives[j].timestamps.length; k++){
                  object = transcript.results[i].alternatives[j].timestamps[k];
                  finalObject.push(object);
            }
          } 
          }
          wordTimings = JSON.stringify(finalObject);
          console.log('WordTIMINGS: ', wordTimings);
          mapping(wordTimings);
          console.log("OUTPUT:",outPut);
          console.log("WORDS: ", words);
          for(item in words){
            words[item] = words[item].replace("'", "");
          }
          var text_translation = JSON.stringify(transcript, null, 2);
          var data = fs.writeFile('file2', text_translation, 'utf8',function(error){
            if(error) throw error;
            console.log('file written');
          });
      }
      res.send(words);
      console.log("YEEEEEESS");
      outPut = "";
      res.status(200);
      });
      

    

});



function mapping(times){
  var tempy;
  var tempyTimes;
  var tempMessage;
  var arrayStuff;
  var tempJSON;
  var tempString;
  console.log("executing mapping");
  

  //console.log("TEMMMMMMPPY: ",req.session.output);
  var PythonShell = require('python-shell');
  var pyshell = new PythonShell('english_breakdown.py');
  //res.redirect('/');
  pyshell.send(JSON.stringify(words));

  pyshell.on('message', function (message) {
      console.log("returned from pyshell");
      console.log(message);
      messageString = message;
      messageString = messageString.replace(/'/g, '"');


      });

  pyshell.end(function (err) {
      if (err){
          throw err;
      };

      console.log("times: ", times);
      tempyTimes = JSON.parse(times);
      console.log("TEmpyTimes");
      console.log(tempyTimes);
      //tempyTimes = tempyTimes.reverse();
      console.log("TEMPYYYYYYTIMES: ", tempyTimes[0]);
    //   var tempObj = {
    //   "okay": ["AO0", "K", "AE0", "Y"],
    //   "lets": ["L", "EH0", "T", "S"],
    //   "party": ["P", "AE0", "R", "T", "Y"],
    //   "and": ["AE0", "N", "D"]
    // }
    tempObj = JSON.parse(messageString);

    console.log(tempObj);
  
      console.log(Object.keys(tempObj)[0].length);
      for(var i =0; i <Object.keys(tempObj).length;++i){
     
        for(var j =0; j < Object.keys(tempObj)[i].length; ++j){
          difference = tempyTimes[i][2] - tempyTimes[i][1];
          
          var tempvalue= tempObj[Object.keys(tempObj)[i]][j];
          rangeSplit += 0;
          console.log("Phoneme: ", JSON.stringify(tempObj[Object.keys(tempObj)[i]][j]));
          newObject.push([tempObj[Object.keys(tempObj)[i]][j], tempyTimes[i][1] += rangeSplit]);
          rangeSplit = difference/3;
        }

      }
      console.log("NEW OBJECT: ",newObject);
    tempJSON = JSON.stringify(tempObj);
    console.log(tempJSON);
     for(var i =0; i < newObject.length;++i){
        tempString += newObject[i][0] + " " + newObject[i][1].toFixed(2) + "\n";
    }//check what's happening here
      tempString = tempString.trim();
      fs.writeFile('phonemes.dat', '', function(){console.log('done')});
      fs.appendFile('phonemes.dat',tempString, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
      //pullimages();
      });
      

};
//this pulls certain phoneme images depending on the phoneme set you have 
//selected on the front end
function pullimages(query){
  console.log("pulling now");

  fileNames = [];
  var directory = "/public/";
  directory += query;
  console.log("PULL IMAGES: ");
  fs.readdirSync(__dirname + directory).forEach(file => {
  console.log(file);
  fileNames.push(file);
  });

}
//amend the html carousel to display the new images
app.get('/load_images', (req,res)=>{
  pullimages(req.query.mouth);
  res.writeHead(200, {"Content-Type" : "text/html"});
        res.write("<img class='slides' id='" + req.query.mouth + "' src='http://127.0.0.1:4000/" + req.query.mouth + "/" + fileNames[2] + "' />");
        for (i = 2; i < fileNames.length; i++) {
            res.write("<img class='slides' style='display:none;' id='" + req.query.mouth + "' src='http://127.0.0.1:4000/" + req.query.mouth + "/" + fileNames[i] + "' />");
        }
  res.end();

});

app.get('/pidginbreakdown',(req, res) =>{
  console.log("downloading file")

  var filename = req.query.filename;
  console.log("THE FILE NAME ISSSSS:",filename);
    fs.writeFile('message.dat', 'messageString', function (err) {
      if (err) throw err;
      else{
        console.log('It\'s saved! in same location.');
      }
    });
    console.log('finished');
    filename += ".dat";
    var file = __dirname + '/'+ 'download.dat';
    var location = __dirname + '/' + 'phonemes.dat';
    res.set("Content-Disposition", "attachment;filename=somefile.dat");
    res.set("Content-Type", "application/octet-stream");
    res.download(location,filename, function(err){
  if (err) {
    console.log("failed",err);
  } else {
    console.log("download was successful");
    console.log("downloaded",file);
    //res.status(200);
  }
});



// var file = __dirname + '/message.dat';

//   var filename = path.basename(file);
//   //var mimetype = mime.lookup(file);

//   res.set('Content-disposition', 'attachment; filename= hello.dat');
//   res.set("Content-Type", "application/octet-stream");
//   //res.set("Content-Disposition", "attachment;filename=somefile.ext");
//   //res.setHeader('Content-type', mimetype);

//   var filestream = fs.createReadStream(file);
//   filestream.pipe(res)
    // var filename = path.basename(file);
    // var mimetype = mime.lookup(file);

    // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    // res.setHeader('Content-type', mimetype);

    // var filestream = fs.createReadStream(file);
    // filestream.pipe(res);
    


  //var file = __dirname + '/upload-folder/dramaticpenguin.MOV';

  
});

app.get('/wordTimings',(req,res) =>{
  console.log("Sending timings to client: ", wordTimings);
  console.log("sending phonemes to client",newObject);
  resposnseArray[0] = wordTimings;
  resposnseArray[1] = newObject;
  res.send(resposnseArray);
  res.status(200);


});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
