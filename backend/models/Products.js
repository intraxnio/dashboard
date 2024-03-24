const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Products_Schema = new Schema({


  brandUser_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brands",
  },

  product_name: {
    type: String,
  },

  unit_price: {
    type: Number,
  },

  unit_type: {
    type: String,
  },

  is_del: {
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

const Products_Schema_Model = mongoose.model("products", Products_Schema);
module.exports = Products_Schema_Model;
