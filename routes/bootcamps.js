const express = require('express');

const { 
    getBootcamp, 
    getBootcamps, 
    updateBootcamp, 
    createBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
    } 
    = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middleware/advancedResults');


const { protect, authorize } = require('../middleware/auth');


// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();


// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance')
      .get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);





// Use the router.route mehtod to designate the path ('/') and  method
// the .get and the .post mentod (b/c the use the same route 
// i.e no :/id required) to call each API function in the controller  
router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)

// Use the router.route mehtod to designate the path ('/:id') and  method
// the .get, .put  and the .delete mentod (b/c the use the same route 
// i.e :/id required) to call each API function in the controller    
router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

// // Return All Bootcamps
// router.get('/', (req, res, next) => {
//     res.status(200)
//     .json(
//     {
//         success: true, 
//         msg: "Show All Bootcamps",
//         data: [
//             {
//                 id: 1,
//                 Name: "Bob Jones",
//                 email: "bj@email.com",
//                 phone: "234-345-4543"
//             },
//             {
//                 id: 2,
//                 Name: "Jane Smith",
//                 email: "js@email.com",
//                 phone: "245-385-4874"
//             }
//         ]
//     })

    
// })

// // Return a single Bootcamp
// router.get('/:id', (req, res, next) => {
//     res.status(200)
//     .json(
//         {
//             success: true, 
//             msg: `Return a single Bootcamp ${req.params.id}`
//         })   
// });   

// // Add a single Bootcamp
// router.post('/', (req, res, next) => {
//     res.status(200)
//     .json(
//         {
//             success: true, 
//             msg: "Create New Bootcamp"
//         })   
// });    

// // Update a single bootcamp
// router.put('/:id', (req, res, next) => {
//     res.status(200)
//     .json(
//         {
//             success: true, 
//             msg:  `Update Bootcamp ${req.params.id}`
//         })   
// });    

// // Delete a single bootcamp
// router.delete('/:id', (req, res, next) => {
//     res.status(200)
//     .json(
//         {
//             success: true, 
//             msg: `Delete Bootcamp ${req.params.id}`
//         })   
// });  

module.exports = router;