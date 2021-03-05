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
    let query;

    // Copy req.query 
    const reqQuery = {...req.query};

    // Fields to exclude
    const removeFields = ['select','sort','page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Query parameters as a JSON string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc.)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => '$' + match);

    // Extra step?  Do I need this?
    // Finding resource 
    query = Bootcamp.find(JSON.parse(queryStr));


    // Select Fields
    if (req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort){
        const sortBy = req.query.sort.split(',').join('');
        query = query.sort(sortBy);
        
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1 ;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1 ) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();


    query = query.skip(startIndex).limit(limit);



    // Execute our query
    const bootcamps = await Bootcamp.find(query);

    // Pagination Result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit : limit
        }
    }


    res.status(200)
        .json({
            success: true, 
            msg: "Show All Bootcamps",
            count: bootcamps.length,
            pagination : pagination,
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