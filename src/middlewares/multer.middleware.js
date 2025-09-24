import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

 export const upload = multer({ 
    storage,

 })



 // Import the 'multer' library, which is a middleware for handling 'multipart/form-data'.
// It is primarily used for uploading files in Node.js applications.

// const multer = require('multer');

// Define the storage configuration for multer.
// We are telling multer how and where to store the uploaded files.
// const storage = multer.diskStorage({
  
  // 'destination' property tells multer the folder where the uploaded files should be stored.
  // It accepts a callback function with three arguments:
  //   1. req: The incoming request object
  //   2. file: The file object (contains details like fieldname, originalname, encoding, mimetype, etc.)
  //   3. cb: Callback function to specify the destination folder
  // destination: function (req, file, cb) {
    // First argument to cb: null (for error handling, null means no error)
    // Second argument: The folder path where the file should be saved
    // cb(null, './public/temp');
  // },

  // 'filename' property defines how the uploaded file should be named in the storage.
  // Again, it accepts a callback function with:
  //   1. req: The incoming request object
  //   2. file: The file object
  //   3. cb: Callback function to specify the new file name
  // filename: function (req, file, cb) {
    // 'uniqueSuffix' is a string we generate to make each filename unique.
    // It uses:
    //   Date.now() -> current timestamp (milliseconds since 1970)
    //   Math.random() * 1E9 -> random number up to 1,000,000,000 (1E9)
    //   Math.round(...) -> rounds the random number to the nearest integer
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // 'file.fieldname' is the name of the field in the form (e.g., "profilePic" or "videoFile")
    // We concatenate it with the uniqueSuffix so that uploaded files don’t overwrite each other.
    // Example: "profilePic-1694872342342-483920493"
    // cb(null, file.fieldname + '-' + uniqueSuffix);
  // }
// });

// Create an upload middleware using the storage configuration above.
// 'upload' is now a multer instance that can be used in routes to handle file uploads.
// Example usage:
//   app.post('/upload', upload.single('profilePic'), (req, res) => {...})
// 
//   - upload.single(fieldname): Uploads a single file with the given fieldname
//   - upload.array(fieldname, maxCount): Uploads multiple files for the same fieldname
//   - upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
//   - upload.any(): Accepts all files
// 
// NOTE: Always validate file types & size using 'fileFilter' and 'limits' options for security!
//  export const upload = multer({ storage: storage });
