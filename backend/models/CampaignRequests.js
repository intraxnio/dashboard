const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignRequests_Schema = new Schema({



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

const CampaignRequests_Schema_Model = mongoose.model("campaignRequests", CampaignRequests_Schema);
module.exports = CampaignRequests_Schema_Model;
