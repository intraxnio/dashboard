const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignDeclinedRequests_Schema = new Schema({



  campaign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaigns",
  },

  creator_id:
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'influencers'

    },

    quoted_price:{
        type: Number

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

const CampaignDeclinedRequests_Schema_Model = mongoose.model("campaignDeclinedRequests", CampaignDeclinedRequests_Schema);
module.exports = CampaignDeclinedRequests_Schema_Model;
