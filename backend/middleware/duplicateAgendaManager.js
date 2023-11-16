const Agenda = require('agenda');
const Campaign = require('../models/Campaign');
const ScheduledPosts = require('../models/ScheduledPosts');
const Influencer = require('../models/Influencer');
const axios = require('axios');

const username = 'intraxnio';
const password = 'Pa55w0Rd';
const dbUrl = 'mongodb+srv://' + username + ':' + password + '@cluster0.1u64z5l.mongodb.net/?retryWrites=true&w=majority';

const agenda = new Agenda({ db: { address: dbUrl } });



const processRequestsAndStatus = async (requestPromises) => {

const containerArray = [];

  try {
    // const responses = await Promise.all(requestPromises);

    requestPromises.forEach((res2, index) => {
      console.log('ID:::', res2.data.id);
      containerArray.push(res2.data);
    });
    console.log('Container Array 1:::', containerArray);
    return containerArray;
  } catch (error) {
    console.log('Error:', error);
    // Handle errors as needed
  }
};

// const getContainerArrayStatus = async (requestPromises, creator_details, campaignId, user_id, brandUser_id, costPerPost, publishDate) => {
//   const containerArray = [];

//   await processRequestsAndStatus(requestPromises, containerArray);

//   const processStatus = async () => {
//     for (const containerArrayItem of containerArray) {
//       try {
//         const statusResponse = await axios.get(
//           'https://graph.facebook.com/v17.0/' +
//             containerArrayItem.id +
//             '?fields=status_code&access_token=' +
//             creator_details.access_token
//         );
//         console.log('Status Response:::', statusResponse.data);

//         if (statusResponse.data.status_code !== 'FINISHED') {
//           containerArray.splice(0, containerArray.length);
//           await processRequestsAndStatus(requestPromises, containerArray);
//           return processStatus(); // Re-run the status check
//         }
//       } catch (error3) {
//         // Handle error if needed
//       }
//     }

//     await ScheduledPosts.create({
//       campaign_id: campaignId,
//       influencer_id: user_id,
//       mediaContainer: containerArray,
//       brandUser_id: brandUser_id,
//       costPerPost: costPerPost,
//       publishDate: publishDate,
//     });

//     const publishJobData = {
//       campaignId: campaignId,
//       user_id: user_id,
//       brandUser_id: brandUser_id,
//     };

//     const utcTimestamp = new Date(publishDate);
//     const istTimestamp = new Date(utcTimestamp.getTime() + (5 * 60 + 30) * 60000);

//     // Format the IST timestamp as a string
//     const formattedIstTimestamp = istTimestamp.toISOString().slice(0, 19);
//     const scheduledDate = new Date(formattedIstTimestamp);
//     scheduledDate.setMinutes(scheduledDate.getMinutes() + 1);

//     await agenda.schedule(scheduledDate, 'Publish Post', publishJobData);
//   };

//   await processStatus();
// };

const getContainerArrayStatus = async (requestPromises, campaignId, user_id, brandUser_id, costPerPost, publishDate, fileType) => {

  processRequestsAndStatus(requestPromises).then(async (container)=>{

    console.log('Container Array 2:::', container);

      // Create ScheduledPosts and schedule 'Publish Post' inside this block
      await ScheduledPosts.create({
        campaign_id: campaignId,
        influencer_id: user_id,
        mediaContainer: container,
        brandUser_id: brandUser_id,
        costPerPost: costPerPost,
        publishDate: publishDate,
        fileType: fileType
      });
   

  })


};



const processCreateContainers = async (campaignId, user_id, brandUser_id, costPerPost, publishDate) => {
  const responsesArray = [];
  try {
    await Influencer.findById(user_id).then(async (creator_details)=>{

      Campaign.findById(campaignId).then(async (campaignDetails)=>{

        const instagram_account_id = creator_details.instagram_business_account_id;
        const access_token = creator_details.access_token;
        const fileType = campaignDetails.fileType;
        const capt = campaignDetails.caption;
        const caption = encodeURIComponent(capt);

        console.log('Instagram:::', instagram_account_id);
        console.log('access_token:::', access_token);
        console.log('caption:::', caption);


        if (!campaignDetails) {
          console.log('Campaign not found');
          return;
        }

      
    else {

      if(fileType === 'image' && campaignDetails.mediaFiles.length > 1){
        
      }

    for (const imageUrl of campaignDetails.mediaFiles) {
      try {

        console.log('imageUrl::::', imageUrl);

        const url =
        'https://graph.facebook.com/v17.0/' + instagram_account_id + '/media?image_url=' + imageUrl +
        '&caption=' + caption + '&access_token=' + access_token;

        console.log('Urlllll::::', url);
        const ress = await axios.post(url);
        console.log('Ressssss::::', ress);
        responsesArray.push(ress);
      } catch (errorr) {
        console.log('Error while generating containers', errorr);
      }
    }

          console.log('Responseesssss::::', responsesArray);
      // Here, all Axios requests have completed successfully.
      // You can now call getContainerArrayStatus and log the result.
      await getContainerArrayStatus(
        responsesArray,
        campaignId,
        user_id,
        brandUser_id,
        costPerPost,
        publishDate,
        fileType
      );

    }

      console.log('Campaign published:', campaignId);
      }).catch((err2)=>{
        console.log('Error at Campaign', err2);
  
      })

    }).catch((err3)=>{
      console.log('Error at Influencer', err3);
    })



    } catch (error) {
      console.error('Error processing job:', error);
    }
  };


agenda.define('Create Containers', async (job) => {
  const { campaignId, user_id, brandUser_id, costPerPost, publishDate } = job.attrs.data;
  await processCreateContainers(campaignId, user_id, brandUser_id, costPerPost, publishDate);

  const publishJobData = {
    campaignId: campaignId,
    user_id: user_id,
    brandUser_id: brandUser_id,
  };


  const utcTimestamp = new Date(publishDate);
  const istTimestamp = new Date(utcTimestamp.getTime() + (5 * 60 + 30) * 60000);

  // Format the IST timestamp as a string
  const formattedIstTimestamp = istTimestamp.toISOString().slice(0, 19);
  const scheduledDate = new Date(formattedIstTimestamp);
  const publishedDate = scheduledDate.setMinutes(scheduledDate.getMinutes() + 1);

  agenda.schedule(publishedDate, 'Publish Now', publishJobData);


});

agenda.define('Publish Now', async (newJob) => {
  const { campaignId, user_id, brandUser_id } = newJob.attrs.data;

  try {
    const creator_details = await Influencer.findById(user_id);

    const results = await ScheduledPosts.findOne({
      campaign_id: campaignId,
      influencer_id: user_id,
      brandUser_id: brandUser_id,
    });

    if (results) {
      console.log('Scheduled Posts::::', results);

      if (results.mediaContainer && results.mediaContainer.length > 0) {
        // Assuming mediaContainer is an array, check if it's not empty
        const creationId = results.mediaContainer[0].id;

        const publishedResult = await axios.post(
          'https://graph.facebook.com/v17.0/' +
            creator_details.instagram_business_account_id +
            '/media_publish?creation_id=' +
            creationId +
            '&access_token=' +
            creator_details.access_token
        );

        console.log(publishedResult.data);
        console.log('published');
      } else {
        console.error('results.mediaContainer is empty');
        // Handle the case where results.mediaContainer is empty
      }
    } else {
      console.error('Campaign not found');
    }
  } catch (error) {
    console.error('Error in Publish Post:', error);
    // Handle error if needed
  }
});



 

  



module.exports = agenda;

// Rest of your agenda configuration
