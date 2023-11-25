const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AllBrandCategories_Schema = new Schema({




    brand_category:{
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

const All_BrandCategories_Schema_Model = mongoose.model('all_brand_categories', AllBrandCategories_Schema);
module.exports = All_BrandCategories_Schema_Model;
