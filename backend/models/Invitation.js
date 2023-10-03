const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Invitation_Schema = new Schema({

    campaign_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'campaigns'},

    received_interests:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'influencers'

        }
    ],

    accepted_interests:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'influencers'

        }

    ],

    declined_interests:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'influencers'

        }

    ],

    onGoing_camp_influencers:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'influencers'

        }

    ],

    finished_camp_influencers:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'influencers'

        }

    ],

    mark_closed_influencers:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'influencers'

        }

    ],

    is_completed:{
        type: Boolean,
        default: false
    },

    is_del: {
        type: Boolean,
        default: false
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date

    }
});


const Invitation_Schema_Model = mongoose.model('invitations', Invitation_Schema);
module.exports = Invitation_Schema_Model;
