import React, { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Stack,
  Box,
  Grid,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Dialog, DialogTitle, DialogActions, DialogContent, Typography, Alert, AlertTitle
} from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import axios from "axios";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CircularProgress from '@mui/material/CircularProgress';
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import dayjs from 'dayjs';
import samplePost from '../../images/IMG_2533.jpg'








function CreateCampaign() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [campaignName, getCampaignName] = useState("");
  const user = useSelector((state) => state.brandUser);
  const [fileType, getFileType] = useState("image");
  const [caption, getCaption] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [dataForm, setDataForm] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Store the selected image file
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const baseUrl = "http://localhost:8000/api";
  const baseUrl = "https://13.234.41.129:8000/api";



  const today = new Date();
  today.setDate(today.getDate() + 1); // Set the minimum allowed date to tomorrow


  const handleFileTypeChange = (e) => {
    getFileType(e.target.value);
  };

  const handleBackClick = () => {
    navigate(`/brand/campaigns`);

  };


  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let duration = 0;
    let videoHeight = 0;
    let videoWidth = 0;
  
    // Check file limit (max 5 files)
    // if (selectedFiles.length > 5) {
    //   toast.error("You can only select up to 5 images.");
    //   e.target.value = null;
    //   return;
    // }


    if(fileType === 'video'){

    const getVideoDetails = (videoFile) => {
      return new Promise((resolve, reject) => {
          const videoElement = document.createElement('video');
          videoElement.src = URL.createObjectURL(videoFile);

          videoElement.addEventListener('loadedmetadata', () => {
              const roundedDuration = Math.round(videoElement.duration);
              resolve({
                  duration: roundedDuration,
                  videoWidth: videoElement.videoWidth,
                  videoHeight: videoElement.videoHeight,
                  videoSrc: videoElement.currentSrc,
              });
          });
      });
  };

  const processVideoFiles = async () => {
    for (const selectedFile of selectedFiles) {

        if (selectedFile.type.includes('video')) {
            const videoDetails = await getVideoDetails(selectedFile);
            duration = videoDetails.duration;
            videoHeight = videoDetails.videoHeight;
            videoWidth = videoDetails.videoWidth;
            console.log('Duration: ' + duration + ' seconds');
            // console.log('Video width: ' + videoDetails.videoWidth + ' pixels');
            console.log('Video height: ' + videoDetails.videoHeight + ' pixels');
            // console.log('Video source URL: ' + videoDetails.videoSrc);
        }
    }

    // Set video duration after processing video files
    setVideoDuration(duration);
    setVideoHeight(videoHeight);
    setVideoWidth(videoWidth);
};

  

processVideoFiles();
  }


  else if(fileType === 'image')
  {
setImageFiles(selectedFiles);

  }


  };

  
  

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  



  const handleSubmit = async (e) => {
    e.preventDefault();

  const formData = new FormData();

  formData.append('campaignName', campaignName);
    formData.append('caption', caption);
    formData.append('publishDate', selectedDate);
    formData.append('fileType', fileType);
    formData.append('userId', user.brand_id);
    formData.append('duration', videoDuration);
  
    imageFiles.forEach((file, index) => {
      formData.append(`images`, file);
    });

    if( !campaignName || !caption || !selectedDate){
      setLoading(false);
      toast.warning("All fields are mandatory");
    }

    else if( !campaignName.trim() || !caption.trim()){
      setLoading(false);
      toast.warning("Invalid input information");
    }

    else if( campaignName.length < 8){
      setLoading(false);
      toast.warning("Campaign Name should be minimum 8 characters");
    }

    else if( caption.length < 50){
      setLoading(false);
      toast.warning("Caption should be minimum 50 characters");
    }

    else if( imageFiles.length === 0){
      setLoading(false);
      toast.warning("Please upload media file(s)");
    }

    // else if( videoDuration > 60 && (videoWidth < 1920 || videoHeight < 1080 || videoHeight > 1080)){
    //   setLoading(false);
    //   setErrorMessage("For videos longer than one minute, it's recommended to use an aspect ratio of 16:9 with a width of (1080) px and a height of (608) px maximum.");
    //   setErrorMessage(
    //     <>
    //     <Typography sx={{fontSize :'14px'}}>
    //       For videos longer than one minute, Required video dimensions: <br />
    //     </Typography>
    //     <Typography sx={{fontSize :'15px'}}>
    //       Width = 1920px &nbsp;&nbsp;Height = 1080px
    //     </Typography>
    //     </>

    //     )
    //   setShowAlert(true);
     
    // }

    // else if( videoDuration < 60 && (videoWidth < 1080 || videoHeight < 1920 || videoHeight > 1920) ){
    //   setLoading(false);
    //   // toast.warning("For longer videos (1 Min+), Aspect Ratio should be 16:9 (1080 X 608)px ");
    //   setErrorMessage(
    //     <>
    //     <Typography sx={{fontSize :'14px'}}>
    //     Video with a duration of less than 60 seconds will be uploaded as REEL. <br />
    //     </Typography>

    //     <Typography sx={{fontSize :'15px'}}>
    //     Required Video Dimensions: Width = <span></span> 1080px &nbsp;&nbsp;Height = 1920px
    //     </Typography>
    //     </>

    //     )


    //   setShowAlert(true);
     
    // }

    else if ( (fileType === 'video') && ( videoDuration > 60 && (videoWidth < 1920 || videoHeight < 1080 || videoHeight > 1080))) {
      setLoading(false);
      setErrorMessage(
        <>
          <Typography sx={{ fontSize: '14px' }}>
            For videos longer than one minute, Required video dimensions: <br />
          </Typography>
          <Typography sx={{ fontSize: '15px' }}>
            Width = 1920px &nbsp;&nbsp;Height = 1080px
          </Typography>
        </>
      );
      setShowAlert(true);
    }
    else if ( (fileType === 'video') && (videoDuration < 60 && (videoWidth < 1080 || videoHeight < 1920 || videoHeight > 1920))) {
      setLoading(false);
      setErrorMessage(
        <>
          <Typography sx={{ fontSize: '14px' }}>
            Video with a duration of less than 60 seconds will be uploaded as REEL. <br />
          </Typography>
          <Typography sx={{ fontSize: '15px' }}>
            Required Video Dimensions: Width = 1080px &nbsp;&nbsp;Height = 1920px
          </Typography>
        </>
      );
      setShowAlert(true);
    }
    

    else
    {

      setDataForm(formData);
      setIsDialogOpen(true);

  
    }

  
  
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  
  
  const submitCampaign = async() =>{

    setLoading(true);

    await axios.post("/api/brand/create-campaign", dataForm, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      setLoading(false);
      setIsDialogOpen(false);
      toast.success("Campaign created successfully!");
      navigate("/brand/campaigns");
    })
    .catch((e) => {
      // Handle errors
    });
  }


  return (
    <>
   <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button>

        <Grid container>

                <Grid item xs={8}>
                  <form action="#" method="post" enctype="multipart/form-data">
                    <Box
                      display="flex"
                      flexDirection={"column"}
                      maxWidth={450}
                      margin="auto"
                      padding={1}
                    >
                      <TextField
                        type="text"
                        id="campaignName"
                        onChange={(e) => {
                          getCampaignName(e.target.value);
                        }}
                        margin="normal"
                        variant="outlined"
                        label="Campaign Name"
                      ></TextField>
                      <RadioGroup
                        row
                        name="image-video-group"
                        aria-label="image-video-group"
                        value={fileType}
                        onChange={handleFileTypeChange}
                      >
                        <FormControlLabel
                          control={<Radio />}
                          label="Image(s)"
                          value="image"
                        />
                        <FormControlLabel
                          control={<Radio />}
                          label="Video"
                          value="video"
                        />
                      </RadioGroup>

                      <input
                        type="file"
                        name="images"
                        accept={fileType === "image" ? ".jpg, .jpeg" : ".mp4, .gif"}
                        multiple={fileType === "image"}
                        onChange={handleImageChange}
                      />
                    
                    <ToastContainer autoClose={3000}/>
                    


                      <TextField
                        type="text"
                        label="Caption"
                        multiline
                        variant="outlined"
                        id="caption"
                        onChange={(e) => {
                          getCaption(e.target.value);
                        }}
                        sx={{ marginTop: "25px" }}
                      ></TextField>

                      <Stack spacing={4} sx={{ width: "300px", marginTop: "25px" }}>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                      <DateTimePicker
                          value={selectedDate}
                          minDate={dayjs(today)}
                          disablePast
                          onChange={(newValue) => {
                            setSelectedDate(newValue);
                          }}
                          label="Date of publish"
                          viewRenderers={{
                            hours: renderTimeViewClock
                          }}
      
                          
                        />

                      </DemoContainer>
                    </LocalizationProvider>

                      </Stack>
                      <Button
                        variant="contained"
                        label="Next"
                        size="large"
                        endIcon={<ArrowRightAltIcon />}
                        sx={{
                          marginTop: "30px",
                          maxWidth: "250px",
                        }}
                        onClick={handleSubmit}
                      >
                        Next
                        {loading && (
                <CircularProgress
                  size={24}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: -12, // Center the CircularProgress
                    marginLeft: -12, // Center the CircularProgress
                  }}
                />
              )}
                      </Button>

                      {/* {loading && (
          <CircularProgress size={24} sx={{ marginLeft: '10px' }} /> // Include a material icon here
        )} */}
                    </Box>
                  </form>
                </Grid>

                <Grid item xs={4}>
                  <Typography>Sample Post</Typography>
                <img
                  className="img-fluid"
                  src={samplePost}
                  alt="Passion into Profession"
                />
              </Grid>

        </Grid>


        {caption && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent dividers>
          
          <Typography gutterBottom>
            Please cross-check campaign details, cannot be edited further.
          </Typography>
          <Typography gutterBottom>
          You will start receiving creators requests once campaign is created.
          </Typography>
          <Typography gutterBottom>
           Are you sure want to create new campaign?
          </Typography>
        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setIsDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={
                  submitCampaign
                }
                color="success"
              >
                YES CREATE
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}


{showAlert && (
  <Alert
    severity="error"
    style={{
      position: "fixed",
      top: "5%",
      left: "50%",
      transform: "translateX(-50%)",
    }}
    onClose={()=>{setShowAlert(false)}}
  >
    <AlertTitle>Error</AlertTitle>
    {errorMessage}
  </Alert>
)}

    
    </>
  );
}

export default CreateCampaign;
