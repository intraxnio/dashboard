const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignApprovedRequests_Schema = new Schema({



  campaign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaigns",
  },

  
  caption: {
    type: String,
  },

  brand_id:
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'brands'

    },

  publishDate: {
    type: Date,
  },

  creator_id:
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'influencers'

    },

    accepted_price:{
        type: Number

    },

  is_del: {
    type: Boolean,
    default: false,
  },

  is_scheduled: {
    type: Boolean,
    default: false,
  },

  is_published: {
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

const CampaignApprovedRequests_Schema_Model = mongoose.model("campaignApprovedRequests", CampaignApprovedRequests_Schema);
module.exports = CampaignApprovedRequests_Schema_Model;
