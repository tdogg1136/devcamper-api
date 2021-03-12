const path = require('path')
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
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
   


    res.status(200)
        .json(res.advancedResults);

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
 
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        bootcamp.remove();

        res.status(200)
        .json(
            {
                success: true, 
                data: {}
            });


})

//  @desc       Get bootcamps within a radius
//  @route      GET /api/v1/bootcamps/radius/:zipcode/:distance
//  @access     Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
   
    const { zipcode, distance } = req.params;

    // Get lat / long from geocoder
    const loc = await geocoder.geocode(zipcode);

    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by the radius of the earth
    // Earth Radius = 3963 miles / 6378 kilometers
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
       location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius] } }
    })
    
    res.status(200).json({
        success:  true,
        count: bootcamps.length,
        data: bootcamps
    })
    

});




//  @desc       Upload photo for a single bootcamp
//  @route      PUT /api/v1/bootcamps/:id/photo
//  @access     Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
 
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }


         if (!req.files){
            return next(new ErrorResponse(`Please upload a file`, 400));
         }

         const file = req.files.file;

         // Make sure the image is a photo
         if (!file.mimetype.startsWith('image')){
            return next(new ErrorResponse(`Please upload an image file`, 400));
         } 

         // Check filesize
         if(file.size > process.env.MAX_FILE_UPLOAD){
            return next(new ErrorResponse(`Please upload an image less then ${process.env.MAX_FILE_UPLOAD} bytes`, 400));
         }

         // Create custom filename
         file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

         file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
             if (err){
                return next(new ErrorResponse(`Problem with file upload`, 500));
             }

             await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});
         });
        res.status(200)
        .json(
            {
                success: true, 
                data: file.name
            });


})