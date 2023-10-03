const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstagramDetails_Schema = new Schema({


    influencer_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'influencers'},

    iG_name:{
        type: String
    },

    instagram_business_account_id:{
        type: String
    },

    iG_profile_pic_url:{
        type: String
    },

    category:{
        type: String
    },

    iG_username:{
        type: String
    },
    followers_count:{
        type: Number
    },
    media_count:{
        type: Number
    },

    impressions_last_28days:{
        type: Number
    },
    reach_last_28days:{
        type: Number
    },

    iG_biography:{
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

const InstagramDetails_Schema_Model = mongoose.model('instagram_user_details', InstagramDetails_Schema);
module.exports = InstagramDetails_Schema_Model;
