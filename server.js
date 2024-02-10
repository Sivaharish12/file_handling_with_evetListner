const express=require('express')
const app=express()
const upload=require('./upload_file')
const path=require('path')
const fs=require('fs')
const { log } = require('console')
const EventEmitter = require('events');

const errorEmitter = new EventEmitter();

const baseUrl="http://localhost:5000/files/"
const errorFilePath = __dirname + '/uploads/error.txt';

app.use('/uploads', express.static('uploads'));

app.post('/upload',upload.single('file'),(req,res,next)=>{
    console.log(req.file);
    res.send("File uploaded successfully!");
});

// Middleware to log errors to a file
app.use((req, res, next) => {
    // Attach the errorEmitter to the request object
    req.errorEmitter = errorEmitter;
    next();
});

// Event listener for the 'error' event
errorEmitter.on('error', (err) => {
    console.error(err);
    fs.appendFile(errorFilePath, `${new Date().toISOString()} - ${err.stack}\n`, (appendErr) => {
        if (appendErr) {
            console.error("Error writing to error file:", appendErr);
        }
    });
});

app.get('/files/:name',(req,res)=>{
    const filename=req.params.name;
    const directorypath=__dirname+'/uploads/'
    console.log(directorypath+filename);
    res.download(directorypath+filename,filename,(err)=>{
        if (err) req.errorEmitter.emit('error', err);
    })
})

app.get('/files',(req,res)=>{
    const directorypath=__dirname+'/uploads'
    console.log(directorypath);
    fs.readdir(directorypath,function(err,files){
        console.log(files);
        if(err){
            res.status(500).send({
                message:"Unable to scan file!"
            });
        }
        let files_info=[]
        files.forEach((file)=>{
            files_info.push({
                name:file,
                url:baseUrl+file,
            });
        res.send(files_info)
        });
    })
})



app.listen(5000);