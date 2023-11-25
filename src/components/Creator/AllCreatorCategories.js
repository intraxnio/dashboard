const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AllCreatorCategories_Schema = new Schema({




    creator_category:{
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

const All_CreatorCategories_Schema_Model = mongoose.model('all_creator_categories', AllCreatorCategories_Schema);
module.exports = All_CreatorCategories_Schema_Model;
