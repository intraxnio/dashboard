const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PublishedPosts_Schema = new Schema({


    campaign_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'campaigns'},

        influencer_id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'influencers'},

        media_id:
            {
                type: String
            },
            

    brandUser_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'brands'},

        costPerPost:
            {
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


const PublishedPosts_Schema_Model = mongoose.model('publishedPosts', PublishedPosts_Schema);
module.exports = PublishedPosts_Schema_Model;
