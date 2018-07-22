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


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

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
  
  
  console.log("SESSION: " + fileUploaded);
  console.log("BOOOOLEAN: ",fileUploaded);
if(fileUploaded == 1){
      fileUploaded = 0;
      res.render('index', { files: userFileName});
}else{
  res.render('index', { files: false });
}
});

app.post('/upload', function(req, res){
  upload(req,res,function(err) {
    if(err) {
      return res.end("Error uploading file.");
    }
    fileUploaded = 1;
    console.log("UPLOADED:",fileUploaded);
    var singleFile = gfs.files.findOne({},{sort: {"uploadDate": -1}},function(err,file){
    console.log("HEllo:",file.filename);
    userFileName = file.filename;
    console.log("THIS IS THE AUDIO FILE",userFileName);
  });
    res.redirect('/');
    
});
});

app.get('/audio',(req, res) => {
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

app.listen(4000,function(){
    //fileServer.serve(req, res);
    console.log("Working on port 4000");
});