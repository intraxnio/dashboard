import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField
} from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel"; // Import Carousel component
import ReactPlayer from "react-player";
import { format } from 'date-fns-tz';







function BrandShowCampaignDetails() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get("campaignId");
  const [campaignData, setCampaignData] = useState([]);
  const user = useSelector(state => state.brandUser);

 


  const makeSecondRequest = (id) => {
      return axios.post("/api/brand/get-campaign-details", {
        userId: id, campaignId: campaignId });
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const secondResponse = await makeSecondRequest(user.brand_id);
        setCampaignData(secondResponse.data.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  function formatPublishDate(publishDate) {
    const date = new Date(publishDate);
      return format(date, 'dd-MM-yyyy hh:mm:ss a', { timeZone: 'Asia/Kolkata' });
  }


  return (
   
   
   <>

   <Grid container spacing={1} padding={2} >

<Grid item xs={4} sx={{ maxHeight: "80vh", overflowY: "auto" }}>
      {campaignData && campaignData.fileType === "image" ? (
        <Carousel showArrows={true} showThumbs={false}>
          {campaignData.mediaFiles.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Image ${index}`} />
            </div>
          ))}
        </Carousel>
      ) : campaignData && campaignData.fileType === "video" ? (
        <ReactPlayer
          url={campaignData.mediaFiles[0]} // Assuming there's only one video URL
          width="45vh"
          maxHeight="80vh"
          overflow='hidden'
          controls={true} // Show player controls (play, pause, volume, etc.)
        />
      ) : (
        // Render loading indicator or other content while data is being fetched
        <div>Loading...</div>
        )}
        </Grid>


  
  <Grid item xs={8} sx={{ maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

    <Box display='flex' flexDirection={'column'} margin='auto' padding={1} >
    <TextField
        label="Campaign Name"
        variant="outlined"
        InputProps={{ readOnly: true }}
        value={campaignData.campaign_name}
        InputLabelProps={{
          shrink: true, // Move the label up when there's a value
          margin: 'dense', // Adjust the margin to avoid overlap
          transform: 'translate(14px, 16px) scale(1)', // Adjust the label's position
        }}
        sx={{
          width: '100%',
          marginBottom: '15px',
        }}
      />
     <TextField
        label="Caption"
        variant="outlined"
        multiline
        InputProps={{ readOnly: true }}
        InputLabelProps={{
          shrink: true, // Move the label up when there's a value
          margin: 'dense', // Adjust the margin to avoid overlap
          transform: 'translate(14px, 16px) scale(1)', // Adjust the label's position
        }}
        rows={9}
        value={campaignData.caption}
        sx={{
          width: '100vh',
          marginBottom: '15px',
        }}
      />
      {campaignData.publishDate && (
            <TextField
              label="Publish Date"
              variant="outlined"
              InputProps={{ readOnly: true }}
              InputLabelProps={{
                shrink: true,
                margin: 'dense',
                transform: 'translate(14px, 16px) scale(1)',
              }}
              value={formatPublishDate(campaignData.publishDate)}
              sx={{
                width: '100%',
                marginBottom: '15px',
              }}
            />
          )}

      <Box mt='auto'>
        
      </Box>
      </Box>
      
        </Grid>
      </Grid>

      </>
  );


  
}

export default BrandShowCampaignDetails;
