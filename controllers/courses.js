const ErrorResponse = require('../utils/errorResponse');
const Course =  require('../models/Course');
const Bootcamp =  require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const { count } = require('../models/Course');

//  @desc       Get  Courses
//  @route      GET /api/v1/courses
//  @route      GET /api/v1/bootcamps/:bootcampId/courses
//  @access     Public
exports.getCourses = asyncHandler(async (req, res, next) => {

    // let query;

    if(req.params.bootcampId){
       const courses = await Course.find({bootcamp: req.params.bootcampId})
       return res.status(200).json({
           success : true,
           count: courses.length,
           data : courses
        })
    } else {
        // query = Course.find().populate({ 
        //     path: 'bootcamp',
        //     select : ' name description'
        // });

        res.status(200).json(res.advancedResults);

    }

    // const courses = await query;

    // res.status(200)
    //     .json({
    //         success: true,
    //         count: courses.length,
    //         data: courses 
    //     })

});


//  @desc       Get a single course
//  @route      GET /api/v1/courses/:id
//  @access     Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await (await Course.findById(req.params.id)).populate({
        path : 'bootcamp',
        select : 'name description'
    });

    if(!course){
        return next(new ErrorResponse(`No course with the ID of: ${req.params.id}`), 404);
    }

    res.status(200)
        .json({
            success: true,
            data: course 
        });
});


//  @desc       Add a single course
//  @route      POST /api/v1/bootcamps/:bootcampId/courses
//  @access     Private
exports.addCourse = asyncHandler(async (req, res, next) => {

    // This takes the Bootcamp and adds it to the body to be passed into Course create
    req.body.bootcamp = req.params.bootcampId;


    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with the ID of: ${req.params.bootcampid}`), 404);
    }

    const course = await Course.create(req.body);

    res.status(200)
        .json({
            success: true,
            data: course 
        });
});

//  @desc       Update a single course
//  @route      PUT /api/v1/courses/:id
//  @access     Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id)

    if(!course){
        return next(new ErrorResponse(`No course with the ID of: ${req.params.id}`), 404);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        data: course
        });

    res.status(200)
        .json({
            success: true,
            data: course 
        });
});

//  @desc       Delete a single course
//  @route      DELETE /api/v1/courses/:id
//  @access     Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)

    if(!course){
        return next(new ErrorResponse(`No course with the ID of: ${req.params.id}`), 404);
    }

    await course.remove();

    res.status(200)
        .json({
            success: true,
            data: {} 
        });
});