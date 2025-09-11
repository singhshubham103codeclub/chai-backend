class Apierr extends Error {// Define a class Apierr that extends the built-in Error class
    constructor(// Constructor method to initialize the error object
        statuscode,
        message = "Something went wrong",
        errore = [],
        stack = ""
    ) {// Default values for message, errore, and stack
        super(message); // call parent class constructor

        this.statuscode = statuscode;// Set the statuscode property
        this.message = message;// Set the message property
        this.errore = errore;// 
        this.data = null;// Set the data property to null
        this.success = false; // use boolean, not string

        if (stack) {// If a stack trace is provided, set the stack property
            this.stack = stack;// Set the stack property
        } else {// If no stack trace is provided, capture the current stack trace
            Error.captureStackTrace(this, this.constructor); // Capture the current stack trace
        }
    }
}
export default Apierr;// Export the Apierr class as the default export of the module
// This module is used to create custom error objects that can be thrown and caught in the application. 
// It extends the built-in Error class and adds additional properties like statuscode, errore, data, and success to provide more context about the error. 
// This helps in consistent error handling and response formatting across the application.