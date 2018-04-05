const express = require('express');
const connect = require('connect');
const http = require('http');
var PythonShell = require('python-shell');
const  cookieSession = require('cookie-session');
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
var filesFound;
var words = new Array();
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
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
/*app.use(session({
  genid: function(req){
    return uuid.v1();
  },
  resave: false,
  saveUnititialized: false,
  secret: 'keyboard cat',
  cookie : {maxAge: 6000}
}))*/


app.use(cookieSession({
  genid: function(req){
    return uuid.v1();
  },
    name: 'session',
    maxAge: null,
  keys: ['key1', 'key2']

}));

/*app.use(function(req,res){
  req.session.cookie.expires = false;
  console.log("session ended");
})*/

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
        const filename = buf.toString('hex') + path.extname(file.originalname);
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

// @route GET /
// @desc Loads form
app.get('/', (req, res) => {
  if(req.session.views){
    req.session.views ++;
  }
  filesFound = gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'audio/wav' ||
          file.contentType === 'audio/mp3'
        ){
          file.isAudio = true;
        } else {
          file.isAudio = false;
        }
      });

      res.render('index', { files: files });
    }
  });
});

// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload', function(req, res){
  upload(req,res,function(err) {
    if(err) {
      return res.end("Error uploading file.");
    }
    //res.json({ file: req.file });
    //res.render('index', { files:files, upload: true});

    res.redirect('/');
});

 
});






app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

app.get('/audio/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'audio/x-wav' || file.contentType === 'audio/mpeg') {
      // Read output to browser
      
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
      
      soundFile = file.filename;
      console.log(soundFile);
      
        var params = {
          audio: gfs.createReadStream(file.filename),
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
          //console.log(JSON.stringify(transcript, null, 2));
          //var obj = JSON.parse(transcript);
          outPut = "";
          words = [];
          for(var i =0; i < transcript.results.length;++i){
              outPut += transcript.results[i].alternatives[0].transcript;
          
            for(var j = 0; j < transcript.results[i].alternatives.length;++j){
              for (var k = 0; k < transcript.results[i].alternatives[j].timestamps.length; k++){
                words .push(transcript.results[i].alternatives[j].timestamps[k][0]);
               
              }
            }
          }
          //console.log("OUTPUT " , outPut);
          //console.log(words);
          for(item in words){
            //console.log(words[item]);
            words[item] = words[item].replace("'", "");
            //console.log(words[item]);
          }
          //Sconsole.log(words);
        
          //console.log(transcript.results[1].alternatives[0].transcript);
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

app.get("/pidgin_breakdown", callPidgin);

function callPidgin(req, res) {

var PythonShell = require('python-shell');
var pyshell = new PythonShell('pidgin_breakdown.py');
//res.redirect('/');
pyshell.send(JSON.stringify(words));

pyshell.on('message', function (message) {
    console.log(message);
});

pyshell.end(function (err) {
    if (err){
        throw err;
    };

    console.log('finished');
});
res.redirect('/');
}

app.get('/text',(req, res) =>{
      console.log("YEEEEEESS");
      res.send(outPut);
      res.status(200);
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
    console.log("Working on port 3000");
});
