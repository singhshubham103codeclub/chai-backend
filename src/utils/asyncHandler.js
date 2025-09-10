const AsyncHandler=(passedFunction)=>async(req,res,next)=>{// A higher-order function that takes a function as an argument and returns a new function and extract the req,res,next from it
    try {
        await passedFunction(req,res,next)// Call the passed function with req, res, and next
    } catch (error) {
       res.status(error.code || 500).json({success:false,message:error.message}) // If an error occurs, send a JSON response with the error message and status code  
    }
}
//second method
// const AsyncHandler=(passedFunction)=>(req,res,next)=>{// A higher-order function that takes a function as an argument and returns a new function and extract the req,res,next from it
//     Promise.resolve(passedFunction(req,res,next)).catch(next)// Call the passed function with req, res, and next
// }
//third method sme as second method00
const asyncHandler=(requestHandler)=>{(reqs,res,next)=>{
    Promise.resolve(requestHandler(reqs,res,next))
    .catch((err)=>next(err))
}}
export default AsyncHandler// Export the AsyncHandler function as the default export of the module30
//module is used to handle asynchronous operations in Express.js routes and middleware like database operations or API calls, and ensures that any errors are properly caught and handled without crashing the application.
// It helps to keep the code clean and avoids repetitive try-catch blocks in each route handler or database operation and middleware function.
