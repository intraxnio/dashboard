import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  Stack,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import sideImage from "../../images/banner2.jpg";
import sideImage2 from "../../images/IMG_1026.jpg"
import sideImage3 from "../../images/IMG_1023.jpg"
import sideImage4 from "../../images/IMG_1027.jpeg"
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useParams } from "react-router-dom";
import BrandSideNavBar from "./BrandSideNavBar";
import Tooltip from '@mui/material/Tooltip';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel"; // Import Carousel component
import ReactPlayer from "react-player";






function BrandShowCampaignDetails() {

  const navigate = useNavigate();
  // const { campaignId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get("campaignId");
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [requests, setRequests] = useState();
  const [editMode, setEditMode] = useState(false);

  const [campaignName, getCampaignName] = useState(campaignData.campaign_name);
  const [fileType, getFileType] = useState(campaignData.fileType);
  const [caption, getCaption] = useState(campaignData.caption);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const user = useSelector(state => state.brandUser);


  const makeSecondRequest = (id) => {
    // return axios.post("http://localhost:8000/api/v1/brand/get-campaign-details", {
      return axios.post("https://app.buzzreach.in/api/v1/brand/get-campaign-details", {
        userId: id, campaignId: campaignId });
  };

  const makeThirdRequest = () => {
    // return axios.post("http://localhost:8000/api/v1/brand/campaign-new-requests-total-number", {
      return axios.post("https://app.buzzreach.in/api/v1/brand/campaign-new-requests-total-number", {
        campaignId: campaignId });
  };


  useEffect(() => {
    const fetchData = async () => {


      try {
      
        setUserId(user.brand_id);
        const secondResponse = await makeSecondRequest(user.brand_id);
        setCampaignData(secondResponse.data.data);

        const thirdResponse = await makeThirdRequest();
        setRequests(thirdResponse.data.requestsNumber);

        // console.log('Requesttresponse:', thirdResponse.data.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  console.log('Media::::', campaignData);


  async function handleEditCampaign(e) {

    // e.preventDefault();
    getCampaignName(campaignData.campaign_name);
    getCaption(campaignData.caption);
    setSelectedDate(campaignData.publishDate);

    setEditMode(true);
  }

  async function cancelEdit(e){
    e.preventDefault();
    setEditMode(false);
  }

  async function updateCampaign(e) {

    e.preventDefault();
    // await axios.post("http://localhost:8000/api/v1/brand/update-campaign", {
      await axios.post("https://app.buzzreach.in/api/v1/brand/update-campaign", {
      campaignName: campaignName,
      caption: caption,
      // publishDate: selectedDate,
      // fileType: fileType,
      campaignId: campaignId,
      
    }).then(res=>{
      // toast.success("Login Success!");
      // navigate("/brand/dashboard");
      setShowSuccessDialog(true);

        // Close the dialog after 3 seconds
        setTimeout(() => {
          setShowSuccessDialog(false);
          window.location.reload();
        }, 3000);
      // window.location.reload();

    }).catch(e=>{

    })
  
  }

  const onShowRequests = (campaignId) => {
    // Redirect to another page with campaignId and userId
    navigate(`/brand/campaign/requests?campaignId=${campaignId}`);
    // window.open(`/brand/campaign/requests?campaignId=${campaignId}`, '_blank');

  };

  const onShowStats = (campaignId) => {
    // Redirect to another page with campaignId and userId
    navigate(`/brand/campaignMetrics?campaignId=${campaignId}`);

  };


  const handleBackClick = () => {
    navigate('/brand/campaigns'); // Navigate back to the CampaignCard component
  };

  return (
    <>
    {editMode ? (
    <>
      <Grid container spacing="2">
          <Grid item xs={8}>
            <form action="#" method="post">
              <Box
                display="flex"
                flexDirection={"column"}
                maxWidth={450}
                margin="auto"
                marginTop={10}
                padding={1}
              >
                <TextField
                  type="text"
                  id="campaignName"
                  multiline
                  value={campaignName}
                  onChange={(e) => {
                    getCampaignName(e.target.value);
                  }}
                  margin="normal"
                  variant="outlined"
                  label="Campaign Name"
                ></TextField>
                {/* <RadioGroup
                  row
                  name="image-video-group"
                  aria-label="image-video-group"
                  value={fileType}
                  onChange={(e) => {
                    getFileType(e.target.value);
                  }}
                > */}
                  {/* <FormControlLabel
                    control={<Radio />}
                    label="Image"
                    value="image"
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="Video"
                    value="video"
                  />
                </RadioGroup> */}

                <TextField
                  type="text"
                  label="Caption"
                  multiline
                  value={caption}
                  variant="outlined"
                  id="caption"
                  onChange={(e) => {
                    getCaption(e.target.value);
                  }}
                  sx={{ marginTop: "25px" }}
                ></TextField>
                <Stack spacing={4} sx={{ width: "250px", marginTop: "25px" }}>
                  {/* <DatePicker
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        helperText: "Date of Publish",
                      },
                    }}
                    // value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                    }}
                  /> */}
                </Stack>
               
                <Button display='flex' variant="contained" color="success" size='large' onClick={updateCampaign}
                endIcon={<ArrowRightAltIcon />}
           sx={{
               // maxWidth: '300px',
               marginTop: '30px',
               textTransform:'capitalize',
               marginBottom: '12px'
   
               
           }}>
            Save
           </Button>


           <Button key='11' variant="outlined" color="primary" size='large' onClick={cancelEdit}
           sx={{
               // maxWidth: '300px',
              //  marginLeft: '30px',
               textTransform:'capitalize',
               marginBottom: '12px'
               
           }}>
            Cancel
           </Button>
           <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Campaign Updated Successfully
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccessDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>

              </Box>
            </form>
          </Grid>
        </Grid>
      </>

    ):(
      <>

   {/* <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick} sx={{marginBottom: '4px'}}>Back</Button> */}

   <Grid container spacing={1} padding={2} >

  {/* <Grid item xs={4} sx={{ maxHeight: '75vh', overflowY: 'auto' }}>
    <img className="img-fluid" src={campaignData.mediaFile} alt="Passion into Profession" />
  </Grid> */}

<Grid item xs={4} sx={{ maxHeight: "80vh", overflowY: "auto" }}>
      {campaignData.fileType === "image" ? (
        <Carousel showArrows={true} showThumbs={false}>
          {campaignData.mediaFiles.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Image ${index}`} />
            </div>
          ))}
        </Carousel>
      ) : campaignData.fileType === "video" ? (
        <ReactPlayer
          url={campaignData.mediaFiles[0]} // Assuming there's only one video URL
          width="100%"
          height="auto"
          controls={true} // Show player controls (play, pause, volume, etc.)
        />
      ) : (
        // Render loading indicator or other content while data is being fetched
        <div>Loading...</div>
        )}
        </Grid>


  
  <Grid item xs={8} sx={{ maxHeight: '75vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

    <Box display='flex' flexDirection={'column'} margin='auto' padding={1}>
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
          marginBottom: '8px',
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
          marginBottom: '8px',
        }}
      />
      <TextField
        label="Publish Date"
        variant="outlined"
        InputProps={{ readOnly: true }}
        InputLabelProps={{
          shrink: true, // Move the label up when there's a value
          margin: 'dense', // Adjust the margin to avoid overlap
          transform: 'translate(14px, 16px) scale(1)', // Adjust the label's position
        }}
        value={campaignData.publishDate}
        sx={{
          width: '100%',
          marginBottom: '8px',
        }}
        />

<Box mt='auto'> {/* This pushes the buttons to the bottom */}
      {campaignData.is_completed ? (null) : (
        <Button variant="outlined" color="success" size='large' onClick={handleEditCampaign}
          sx={{
            textTransform: 'capitalize',
            marginTop: '12px'
          }}>
          Edit Campaign
        </Button>
      )}


      {/* <Button key='11' size='medium'
        onClick={campaignData.is_completed ? () => onShowStats(campaignId) : () => onShowRequests(campaignId)}
        sx={{
          marginLeft: '30px',
          textTransform: 'capitalize',
          marginTop: '12px'
        }}> */}

        {/* {campaignData.is_completed ? 'Show Metrics' : 
        
        ( 
          <Tooltip
          title='Click to see Received Requests'
          placement='top'
        >
        <AvatarGroup total={requests}>
  <Avatar alt="Remy Sharp" src={sideImage} />
  <Avatar alt="Travis Howard" src={sideImage2} />
</AvatarGroup>
        </Tooltip>
        ) 
        } */}
      {/* </Button> */}




    </Box>
    </Box>
    
  </Grid>
</Grid>

      
      </>
      )}

      </>
  );


  
}

export default BrandShowCampaignDetails;
