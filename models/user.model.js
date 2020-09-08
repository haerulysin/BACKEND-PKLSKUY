const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const userAuthSchema = new Schema({
    username:{
        type:String,
        default: ""
    },

    password: {
        type: String,
        required:true,
    }
}, {
    _id: false
});


const userAddressSchema = new Schema({
    address1: {
        type:String,
        default:'',
    },
    city:{
        default: '',
        type: String
    },
    province:{
        default: '',
        type: String
    },
    postalCode: {
        default: '',
        type: String,
    }
}, {
    _id: false
});

const userReputationSchema = new Schema({
    worksCompleted:{
        type:Number,
        default: 0,   
    },
    onTimeWorks:{
        type:Number,
        default: 0,
    }
},{
    _id: false
});

const userBiodataSchema = new Schema({
    about:{
        default: '',
        type: String,
    },
    photo:{
        default: '',
        type: String,
    }
}, {
    _id: false
});

const userVerificationSchema = new Schema({
    identityVerification:{
        type: Boolean,
        default: false,
    },

    phonenumberVerification: {
        type: Boolean,
        default: false,
    },

    emailVerification: {
        type: Boolean,
        default: false,
    },

}, {
    _id: false
});
const UserSchema = new Schema({
    
    fullName:{
        type: String,
        required: true,
    },

    email: {
        type:String,
        required:true,
    },

    phoneNumber:{
        type:Number,
    },

    auth:userAuthSchema,
    address: userAddressSchema,
    reputation: userReputationSchema,
    biodata : userBiodataSchema,

    joinedOn : {
        type: Date,
        default: Date.now,
    }
},{
    collection: 'user',
});

module.exports = User = mongoose.model("user",UserSchema);