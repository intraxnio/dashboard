const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlanDetails_Schema = new Schema({

  plan_name: {
    type: String,
  },

  frequency: {
    type: String,
  },

  plan_id: {
    type: String,
  },

  no_of_campaigns: {
    type: Number,
  },

 
  price_in_usd: {
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

const PlanDetails_Schema_Model = mongoose.model("plans", PlanDetails_Schema);
module.exports = PlanDetails_Schema_Model;
