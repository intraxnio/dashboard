const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InfluencerTemp_Schema = new Schema({


    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    mobile_num:{
        type: String
    },

    reset_pin:{
        type: Number

    },

    category:{
        type: String
    },
    

    is_del: {
        type: Boolean,
        default: false
    },

    is_active: {
        type: Boolean,
        default: true
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date

    }
});

const InfluencerTemp_Schema_Model = mongoose.model('influencers_temp', InfluencerTemp_Schema);
module.exports = InfluencerTemp_Schema_Model;
