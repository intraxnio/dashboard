const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");


const Brand_Schema = new Schema({

    username: {
        type: String,
    },

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

    brand_name: {
        type: String,
        required: true
    },

    instagram_handle: {
        type: String,
    },

    category: {
        type: String,
        required: true
    },

    balance: {
        type: Number

    },

    purchased_plan: {
      type: String
      },

      brand_logo: {
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


const Brand_Schema_Model = mongoose.model('brands', Brand_Schema);
module.exports = Brand_Schema_Model;
