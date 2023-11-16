const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublishedPostMetrics_Schema = new Schema({

  post_id: {
    type: String,
  },

  avatar: {
    type: String,
  },

  creatorName: {
    type: String,
  },

  profile: {
    type: String,
  },

  pricePerPost: {
    type: Number,
  },

  reach : {
    type: Number

  },

  impressions : {
    type: Number

  },

  engagement: {
    type: Number,
  },

  plays : {
    type: Number

  },

  permaLink: {
    type: String,
  },

  campaign_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'campaigns'},

    brandUser_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'brands'},

  media_type: {
    type: String

  },

  media_product_type: {
    type: String

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

const PublishedPostMetrics_Schema_Model = mongoose.model( "publishedPostMetrics", PublishedPostMetrics_Schema );
module.exports = PublishedPostMetrics_Schema_Model;
