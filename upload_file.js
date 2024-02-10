const multer=require('multer')

// Configuring the storage
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }
});

const upload=multer({
    storage:storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB (adjust as needed)
    },
});


module.exports=upload