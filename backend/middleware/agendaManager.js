const Agenda = require('agenda');
const PublishedPosts = require("../models/PublishedPosts");

const username= "intraxnio";
const password = 'Pa55w0Rd';
var dbUrl= "mongodb+srv://"+username+":"+password+"@cluster0.1u64z5l.mongodb.net/?retryWrites=true&w=majority"

const agenda = new Agenda({ db: { address: dbUrl } });

// Define your job processing logic
agenda.define('New Campaign', async (job) => {
  const { campaignId, user_id, mediaId, brandUser_id, costPerPost } = job.attrs.data;

  try {
    // Your additional processing logic here, e.g., sending notifications

    // Save published post
    await PublishedPosts.create({
      campaign_id: campaignId,
      influencer_id: user_id,
      media_id: mediaId,
      brandUser_id: brandUser_id,
      costPerPost: costPerPost,
    });

    console.log('Campaign published:', campaignId);
  } catch (error) {
    console.error('Error processing job:', error);
  }
});

module.exports = agenda;
