const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AllBankDetails_Schema = new Schema({




    bank_name:{
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

const All_BankDetails_Schema_Model = mongoose.model('all_bank_names', AllBankDetails_Schema);
module.exports = All_BankDetails_Schema_Model;
