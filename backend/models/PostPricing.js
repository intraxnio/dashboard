const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostPricing_Schema = new Schema({




    follower_count_min:{
        type: Number
    },

    follower_count_max:{
        type: Number
    },
    
    cost_per_post_image : {

        type: Number
    },

    cost_per_post_video : {

        type: Number
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

const PostPricing_Schema_Model = mongoose.model('postPricing', PostPricing_Schema);
module.exports = PostPricing_Schema_Model;
