const express = require('express');
const connect = require('connect');
const http = require('http');
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
var watson = require('watson-developer-cloud');
var outPut = "";
var fileUploaded = 0;
var userFileName;
var words = new Array();
var tempWords = new Array();
var temp;


var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
//speech to text
var speech_to_text = new SpeechToTextV1 ({
  version: 'v1',
  "url": "https://stream.watsonplatform.net/speech-to-text/api",
    "username": "44237460-ece1-477e-8912-f6552e8495b0",
    "password": "TNmOa7lGouuS"
});

var soundFile  ='';


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

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
 var singleFile = gfs.files.findOne({},{sort: {"uploadDate": -1}},function(err,file){
      console.log("HEllo:",file.filename);
      userFileName = file.filename;
      req.session.fileUploaded = 0;
      res.render('index', { files: file.filename});

 });
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
    //req.session.fileUploaded = 1;
    res.redirect('/');
    
});
});

app.get('/audio', (req, res) => {
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
      
        var params = {
          audio: gfs.createReadStream(soundFile),
          content_type: 'audio/wav',
          timestamps: true,
          word_alternatives_threshold: 0.9,
          keywords: ['party', 'boys', 'lets'],
          keywords_threshold: 0.5
        };

        speech_to_text.recognize(params, function(error, transcript) {
        if (error){
          console.log('Error:', error);
        }
        else{
          outPut = "";
          words = [];
          for(var i =0; i < transcript.results.length;++i){
              outPut += transcript.results[i].alternatives[0].transcript;
          
            for(var j = 0; j < transcript.results[i].alternatives.length;++j){
              for (var k = 0; k < transcript.results[i].alternatives[j].timestamps.length; k++){
                words .push(transcript.results[i].alternatives[j].timestamps[k][0]);
                req.session.output.push(transcript.results[i].alternatives[j].timestamps[k][0]);
               
              }
            }
          }
          //req.session.output = req.session.output.split(" ");
          var index = req.session.output.indexOf('');
          if(index > -1) req.session.output.splice(index,1);
          console.log("TEMP WORDS: ", req.session.output);
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

         // res.render('index', { outPut : outPut});
      }
      });

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
console.log("TEMMMMMMPPY: ",req.session.output);
var PythonShell = require('python-shell');
var pyshell = new PythonShell('pidgin_breakdown.py');
//res.redirect('/');
pyshell.send(JSON.stringify(words));

pyshell.on('message', function (message) {
    console.log(message);
    fs.writeFile('message.dat', message, function (err) {

        if (err) throw err;

        console.log('It\'s saved! in same location.');

    });
});

pyshell.end(function (err) {
    if (err){
        throw err;
    };

    console.log('finished');
  var file = __dirname + '/message.dat';
  res.download(file);
  console.log("downloaded");
    res.status(200);

});
//res.redirect('/');
});

app.get('/text',(req, res) =>{
      console.log("YEEEEEESS");
      res.send(outPut);
      res.status(200);
});

app.post('/update',(req,res)=>{
  outPut = req.body.output;
  req.session.output = outPut.split(" ");
console.log(req.session.output);
  res.status(200);
})

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
    console.log("Working on port 3000");
});
