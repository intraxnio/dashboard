const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstaPageMetrics_Schema = new Schema({
  insta_page_username: {
    type: String,
  },

  influencer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "influencers",
  },

  audience_country: [
    {
      country: String,
      followers_count: Schema.Types.Mixed,
    },
  ],

  audience_cities: [
    {
      city: String,
      followers_count: Schema.Types.Mixed,
    },
  ],

  age_wise_followers:[
    
  ],

  audience_gender_age: [
    {
      gender: String,
      followers_count: Schema.Types.Mixed,
    },
  ],

  male_percentage: {
    type: Number,
  },

  female_percentage: {
    type: Number,
  },

  other_percentage: {
    type: Number,
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

const InstaPageMetrics_Schema_Model = mongoose.model(
  "instaPageMetrics",
  InstaPageMetrics_Schema
);
module.exports = InstaPageMetrics_Schema_Model;
