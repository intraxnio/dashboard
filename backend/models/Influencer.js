const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Influencer_Schema = new Schema({


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

    access_token:{
        type: String
    },
    
    token_expires_in:{
        type: Number
    },

    token_expiry_date : {

        type: Date
    },

    costPerPost:{
        type: Number
    },

    reset_pin:{
        type: Number

    },

    instagram_business_account_id:{
        type: String
    },

    category:{
        type: String
    },

    is_instagram_connected:{
        type: Boolean,
        default: false
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

const Influencer_Schema_Model = mongoose.model('influencers', Influencer_Schema);
module.exports = Influencer_Schema_Model;
