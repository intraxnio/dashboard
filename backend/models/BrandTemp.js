const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BrandTemp_Schema = new Schema({


    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    reset_pin:{
        type: Number

    },

    instagram_handle: {
        type: String,
    },

    brand_name: {
        type: String,
        required: true
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


const BrandTemp_Schema_Model = mongoose.model('brands_temp', BrandTemp_Schema);
module.exports = BrandTemp_Schema_Model;