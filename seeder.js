const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load Environment Variables
dotenv.config({path : './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');


// Connect to Mongo Database
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser : true,
        useCreateIndex : true,
        useFindAndModify : false,
        useUnifiedTopology: true
    });

// Read the JSON Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// Import data into database
const importData = async () =>{
    try {
        await Bootcamp.create(bootcamps);

        console.log('Data Imported....'.green.inverse)
        process.exit();
    } catch (error) {
        console.error('Something went wrong with data import'.red.inverse, error)
    }
}


// Delete Data
const deleteData = async () =>{
    try {
        await Bootcamp.deleteMany();

        console.log('Data Destroyed....'.red.inverse)
        process.exit();
    } catch (error) {
        console.error('Something went wrong destroying the data', error)
    }
}

if(process.argv[2] === '-import'){
    importData();
} else if (process.argv[2] === '-delete'){
    deleteData();
}