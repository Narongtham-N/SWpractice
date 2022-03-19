const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name:{
        type: String,
        require: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 charaters']
    },
    address:{
        type: String,
        require: [true, 'Please add an address']
    },
    district:{
        type: String,
        require: [true, 'Please add a district']
    },
    province:{
        type: String,
        require: [true, 'Please add a province']
    },
    postalcode:{
        type: String,
        require: [true, 'Please add a postal code'],
        maxlength:[5, 'Postal code cannot be more than 5 digits'] 
    },
    tel:{
        type: String
    },
    region:{
        type: String,
        require: [true, 'Please add a region']
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

//Reverse populate with virtuals
HospitalSchema.virtual('appointments',{
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'hospitals',
    justOne: false
});

//Cascade delete when a hospital is removed
HospitalSchema.pre('remove',async function(next){
    console.log(`Appointments being removed from hospital ${this._id}`);
    await this.model('Appointment').deleteMany({hospital:this._id});
    next();
});

module.exports = mongoose.model('Hospital', HospitalSchema);