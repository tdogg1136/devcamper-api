const ErrorResponse = require('../utils/errorResponse');
const Bootcamp =  require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');



//  @desc       Get all bootcampms
//  @route      GET /api/v1/bootcamps
//  @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // try {
    //     const bootcamps = await Bootcamp.find();
    //     res.status(200)
    //     .json({
    //         success: true, 
    //         msg: "Show All Bootcamps",
    //         count: bootcamps.length,
    //         data: bootcamps
    //     })
    // } catch (err) {
    //     // res.status(400).json({success: false})
    //     next(err);
    // }

    const bootcamps = await Bootcamp.find();

    res.status(200)
        .json({
            success: true, 
            msg: "Show All Bootcamps",
            count: bootcamps.length,
            data: bootcamps
        });

});

//  @desc       Get single bootcampm
//  @route      GET /api/v1/bootcamps/:id
//  @access     Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
//    try {
//     const bootcamp = await Bootcamp.findById(req.params.id);

//     if (!bootcamp){
//        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
//     }

//     res.status(200)
//     .json(
//         {
//             success: true, 
//             data: bootcamp
//         })
       
//    } catch (err) {
//     // res.status(400).json({success: false});
//     // return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

//     next(err);
//    }
  
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200)
        .json(
            {
                success: true, 
                data: bootcamp
            });

})


//  @desc       Create a single bootcampm
//  @route      POST /api/v1/bootcamps/:id
//  @access     Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // try {
    //     console.log(req.body);
    //     const bootcamp = await Bootcamp.create(req.body);

    //     res.status(201)
    //     .json({
    //             success: true, 
    //             data: bootcamp
    //         })
    // }
    // catch (err) {
    //     // res.status(400).json({success: false});
    //     next(err);
    // }    
    console.log(req.body);
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201)
        .json({
                success: true, 
                data: bootcamp
            });

});

//  @desc       Update a single bootcampm
//  @route      PUT /api/v1/bootcamps/:id
//  @access     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    // try {
    //     const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators: true});
        
    //     if(!bootcamp){
    //         return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    //     }
        
    //     res.status(200)
    //     .json(
    //         {
    //             success: true, 
    //             data: bootcamp
    //         })

    // } catch (err) {
    //     // res.status(400).json({success: false});
    //     next(err);
    // }
    
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators: true});
        
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        
        res.status(200)
        .json(
            {
                success: true, 
                data: bootcamp
            });


})

//  @desc       Delete a single bootcamp
//  @route      DELETE /api/v1/bootcamps/:id
//  @access     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    // try {
    //     const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    //     if(!bootcamp){
    //         return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    //     }
    //     res.status(200)
    //     .json(
    //         {
    //             success: true, 
    //             data: {}
    //         })

    // } catch (err) {
    //     // res.status(400).json({success: false});
    //     next(err);
    // }
 
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200)
        .json(
            {
                success: true, 
                data: {}
            });


})