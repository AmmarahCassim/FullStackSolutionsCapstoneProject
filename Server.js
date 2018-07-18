const express = require('express');
const connect = require('connect');
const http = require('http');
var cors = require('cors');
var PythonShell = require('python-shell');
const  session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const uuid = require('node-uuid');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
var nStatic = require('node-static');
var watson = require('watson-developer-cloud');
var outPut = "";
var fileUploaded = 0;
var userFileName;
var words = new Array();
var tempWords = new Array();
var temp;
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

var fileServer = new nStatic.Server('./public');

var soundFile  ='';


const app = express();

var corsOptions = {
  origin: 'http://127.0.0.1:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
//app.use(cors());

 var store = new MongoDBStore(
      {
        uri: 'mongodb://localhost/myDB',
        databaseName: 'myDB',
        collection: 'mySessions'
      });
  store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });

app.use(session({
  genid:function(req){
    return uuid();
  },
     cookie: { maxAge: 60000},
     resave: true,
     saveUninitialized: true,
     secret: "secret",
     store: store
 }));
app.set('view engine', 'ejs');

// Mongo URI
const mongoURI = 'mongodb://localhost/myDB';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);


// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
       filename = buf.toString('hex') + path.extname(file.originalname);
   
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
var upload = multer({ storage : storage}).single('userPhoto');


app.get('/', (req, res) => {
  //var sessData = req.session;
  req.session.output = new Array('');
  var textOutPut = new Array(req.session.output);
  console.log("SESSION: " + req.session.fileUploaded);
  console.log("BOOOOLEAN: ",fileUploaded);
if(req.session.fileUploaded == 1){
 //var singleFile = gfs.files.findOne({},{sort: {"uploadDate": -1}},function(err,file){
      //console.log("HEllo:",file.filename);
      //userFileName = file.filename;
      //req.session.fileUploaded = 0;
      req.session.fileUploaded = 0;
      res.render('index', { files: userFileName});


 //});
}else{
  res.render('index', { files: false });
}
});

app.post('/upload', function(req, res){
  upload(req,res,function(err) {
    if(err) {
      return res.end("Error uploading file.");
    }
    req.session.fileUploaded = 1;
    console.log("UPLOADED:", req.session.fileUploaded);
    var singleFile = gfs.files.findOne({},{sort: {"uploadDate": -1}},function(err,file){
    console.log("HEllo:",file.filename);
    userFileName = file.filename;
    console.log("THIS IS THE AUDIO FILE",userFileName);
  });
    //req.session.fileUploaded = 1;
    res.redirect('/');
    
});
});

app.get('/audio',cors(corsOptions),(req, res) => {
  console.log('you hit the audio endpoint');
  gfs.files.findOne({ filename: userFileName}, (err, file) => {
    // Check if file
    console.log("YO MA",userFileName);
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'audio/x-wav' || file.contentType === 'audio/mpeg') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
      
      soundFile = file.filename;
      console.log(soundFile); //----this is it
      
        gfs.createReadStream(soundFile);

    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }

  });
});


//app.get("/pidgin_breakdown", callPidgin);
app.get('/pidgin_breakdown',(req, res) =>{
//function callPidgin(req, res) {
// console.log("TEMMMMMMPPY: ",req.session.output);
// var PythonShell = require('python-shell');
// var pyshell = new PythonShell('pidgin_breakdown.py');
// //res.redirect('/');
// pyshell.send(JSON.stringify(words));

// pyshell.on('message', function (message) {
//     console.log(message);
//     messageString = message;
    fs.writeFile('message.dat', messageString, function (err) {

        if (err) throw err;

        console.log('It\'s saved! in same location.');

    });
// });

// pyshell.end(function (err) {
//     if (err){
//         throw err;
//     };

    console.log('finished');
  var file = __dirname + '/message.dat';
  res.download(file);
  console.log("downloaded");
    res.status(200);

//});
//res.redirect('/');
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

app.get('/wordTimings',(req,res) =>{
  console.log("Sending timings to client: ", wordTimings);
  resposnseArray[0] = wordTimings;
  resposnseArray[1] = newObject;
  res.send(resposnseArray);
  res.status(200);


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
    tempJSON = JSON.stringify(tempObj);
    console.log(tempJSON);
     for(var i =0; i < newObject.length;++i){
        tempString += newObject[i][0] + " " + newObject[i][1].toFixed(2) + "\n";
    }
      tempString = tempString.trim();
      fs.writeFile('phonemes.dat', '', function(){console.log('done')});
      fs.appendFile('phonemes.dat',tempString, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
      //pullimages();
      });
      

};


function pullimages(query){
  console.log("pulling now");

  // var libs = require('require-all')(__dirname + '/mouths');
  // console.log("pulled from directory:");
  fileNames = [];
  var directory = "/public/";
  directory += query;
  console.log("PULL IMAGES: ");
  fs.readdirSync(__dirname + directory).forEach(file => {
  console.log(file);
  fileNames.push(file);
  });

}
app.get('/load_images', (req,res)=>{
  pullimages(req.query.mouth);
  res.writeHead(200, {"Content-Type" : "text/html"});
        for (i = 1; i < fileNames.length; i++) {
            res.write("<img class='slides' id='" + req.query.mouth + "' src='http://127.0.0.1:3000/" + req.query.mouth + "/" + fileNames[i] + "' />");
        }
  res.end();

});

app.post('/update',(req,res)=>{
  outPut = req.body.output;
  req.session.output = outPut.split(" ");
console.log(req.session.output);
  res.status(200);
  res.redirect('/text');
});

app.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
    conn.dropDatabase();
  });
});



app.listen(3000,function(){
    //fileServer.serve(req, res);
    console.log("Working on port 3000");
});