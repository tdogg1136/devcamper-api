const ErrorResponse = require('../utils/errorResponse');

function errorHandler (err, req, res, next) {
    
    

    let error = {...err};

    
    error.message = err.message;


    console.log(`Error name: ${err.name}`);
    console.log(`Error stack: ${err.stack.red}`);

    // Log to console for dev
   // console.log(`This is the err object: " ${err.stack.red}`); 

    // Mongoose bad ObjectId Format
    if (err.name === 'CastError'){

        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404)

    }

    // Mongoose Duplicate Key
    if (err.code === 11000){
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 404);

    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success : false,
        error : error.message || 'Server Error'
    });
    
    // if (res.headersSent) {
    //   return next(err)
    // }
    
    // res.render('error', { error: err })
  }


  module.exports = errorHandler;