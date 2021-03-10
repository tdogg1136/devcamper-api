const express = require('express');
const dotenv = require('dotenv');
// const logger = require('./middleware/logger');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');


// Load  ENV configuration file
dotenv.config({path: './config/config.env'});


// Connect to Mongo Database
connectDB();


// Import Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

//const { connect } = require('./routes/bootcamps');




// Initialize App variable with Express
const app = express();

// Body parser
app.use(express.json());

// Dev Logging Middleware
// app.use(logger)
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount Router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Error Handler; placed after Router
app.use(errorHandler);




const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log (`Error: ${err.message}`.red.bold);
    // Close server & exit process
    server.close(() => process.exit(1));
});