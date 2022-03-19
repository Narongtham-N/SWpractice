const Hospital = require('../models/Hospital');

// router.get('/', (req,res) => {
//     res.status(200).json({success:true, msg:`Show all hospitals`});
// })

//@description Get all hospitals
//@route GET /api/v1/hospitals
//@access Public
exports.getHospitals= async (req,res,next) => {
    
        let query;

        // Copy req.query
        const reqQuery = {...req.query};

        //Fields to exclude
        const removeFields = ['select','sort','page','limit'];

        //Loop over remove fields and delete them from the reqQuery
        removeFields.forEach(param => delete reqQuery[param])
        console.log(reqQuery)

        //Create query string
        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

        //Select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        };

        //Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt')
        }

        //Pagination
        const page = parseInt(req.query.page, 10)||1;
        const limit = parseInt(req.query.limit, 10)||25;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;  

    try{
        const total = await Hospital.countDocuments();
        query = query.skip(startIndex).limit(limit);

        //Execute query
        const hospitals = await query;

        //Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page:page+1,
                limit
            }
        };

        if (startIndex > 0) {
            pagination.pre ={
                page: page-1,
                limit
            }
        };

        res.status(200).json({success:true,count: hospitals.length, pagination, data:hospitals});
    } catch(err){
        res.status(400).json({success:false});
    }
    
};

// router.get('/:id', (req,res) => {
//     res.status(200).json({success:true, msg:`Show hospital ${req.params.id}`});
// })

//@description Get single hospital
//@route GET /api/v1/hospitals/:id
//@access Public
exports.getHospital = async (req,res,next) => {
    try{
        const hospital = await Hospital.findById(req.params.id)
        if(!hospital){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data: hospital});
    } catch(err){
        res.status(400).json({success:false})
    } 
};

// router.post('/', (req,res) => {
//     res.status(200).json({success:true, msg:`Create new hospitals`});
// })

//@description Create new hospital
//@route POST /api/v1/hospitals
//@access Private
exports.createHospital = async (req,res,next) => {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({success:true, data:hospital});
};

// router.put('/:id',(req,res) => {
//     res.status(200).json({success:true, msg:`Update hospital ${req.params.id}`});
// })

//description Update hospital
//route PUT /api/v1/hospitals/:id
//access Private
exports.updateHospital = async (req,res,next) => {
    try{
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        });
        if(!hospital) {
            return res.status(400).json({success:false})
        }
        res.status(200).json({success:true, data:hospital});
    } catch {
        res.status(400).json({success:false});
    }
};

// router.delete('/:id', (req,res) =>{
//     res.status(200).json({success:true, msg:`Delete hospital ${req.params.id}`})
// })

//description Delete hospital
//route DELETE /api/v1/hospitals
//access Private
exports.deleteHospital = async (req,res,next) => {
    try{
        const hospital = await Hospital.findById(req.params.id);
        if(!hospital){
            return res.status(400).json({success:false});
        }
        hospital.remove();
        res.status(200).json({success:true,data:{}});
    } catch(err) {
        res.status(400).json({success:false});
    } 
}

