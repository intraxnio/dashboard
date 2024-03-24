const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BankDetails_Schema = new Schema({




    bank_name:{
        type: String
    },

    account_number:{
        type: String
    },
    
    ifsc_code:{
        type: String
    },

    influencer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "influencers",
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

const BankDetails_Schema_Model = mongoose.model('bankDetails', BankDetails_Schema);
module.exports = BankDetails_Schema_Model;
