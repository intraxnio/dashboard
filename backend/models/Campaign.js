const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Campaign_Schema = new Schema({

  campaign_name: {
    type: String,
  },

  caption: {
    type: String,
  },

  mediaFiles: [
  ],


  publishDate: {
    type: Date,
    default: Date.now,
  },

 
  fileType: {
    type: String,
  },

  brandUser_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brands",
  },

  brand_name: {
    type: String,
  },

  brand_category: {
    type: String,
  },

  videoDuration: {
    type: Number,
    default: 0
  },

  is_onGoing: {
    type: Boolean,
    default: true,
  },

  is_completed: {
    type: Boolean,
    default: false,
  },

  is_del: {
    type: Boolean,
    default: false,
  },

  is_active: {
    type: Boolean,
    default: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

  updated_at: {
    type: Date,
  },
});

const Campaign_Schema_Model = mongoose.model("campaigns", Campaign_Schema);
module.exports = Campaign_Schema_Model;
