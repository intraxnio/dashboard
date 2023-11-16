const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScheduledPosts_Schema = new Schema({


  campaign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaigns",
  },

  influencer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "influencers",
  },

  mediaContainer: [],

  brandUser_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brands",
  },

  costPerPost: {
    type: Number,
  },

  publishDate: {
    type: Date,
  },

  fileType: {
    type: String,
  },

  is_del: {
    type: Boolean,
    default: false,
  },

  is_stopped: {
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

const ScheduledPosts_Schema_Model = mongoose.model(
  "scheduledPosts",
  ScheduledPosts_Schema
);
module.exports = ScheduledPosts_Schema_Model;
