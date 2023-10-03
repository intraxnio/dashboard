const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostMetrics_Schema = new Schema({

  insta_page_username: {
    type: String,
  },

  influencer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "influencers",
  },

  caption: {
    type: String

  },
  
  beforeBusinessAccount: {
    type: Boolean,
    default: false

  },

  media_id: {
    type: String

  },

  media_type: {
    type: String

  },

  media_product_type: {
    type: String

  },

  impressions: {
    type: Number,
  },

  engagement: {
    type: Number,
  },

  reach: {
    type: Number,
  },

  likes: {
    type: Number,
  },

  comments_count:{
    type: Number,

  },

  media_url: {
    type: String,
  },

  thumbnail_url: {
    type: String,
  },

  permaLink: {
    type: String,
  },

  timeStamp: {
    type: Date
  },

  comments: [
    {
    timeStamp: Date,
    text: String,
    id: Number
    
  }
],

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

const PostMetrics_Schema_Model = mongoose.model(
  "postMetrics",
  PostMetrics_Schema
);
module.exports = PostMetrics_Schema_Model;
