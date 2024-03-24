const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Invoice_Schema = new Schema({

  invoice_number: {
    type: String,
  },

  payee_name : {
    type : String
  },

  payee_mobile_number : {
    type: String
  },

  payee_email : {
    type: String
  },

  shortUrl : {
    type: String
  },

  payment_link_id : {
    type: String
  },

  brandUser_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brands",
  },

  is_payment_captured: {
    type: Boolean,
    default: false,
  },

  invoice_pdf_file: {
    type: String,
    default: ''
  },

  invoice_amount : {
    type: Number
  },

  captured_amount: {
    type: Number,
  },

  products_details: [  ],

  is_del: {
    type: Boolean,
    default: false,
  },

  is_active: {
    type: Boolean,
    default: false,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

  updated_at: {
    type: Date,
  },
});

const Invoice_Schema_Model = mongoose.model("invoices", Invoice_Schema);
module.exports = Invoice_Schema_Model;
