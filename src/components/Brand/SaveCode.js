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
  Dialog, DialogTitle, DialogActions, DialogContent, Typography
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






function CreateCampaign() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [campaignName, getCampaignName] = useState("");
  const user = useSelector((state) => state.brandUser);
  const [fileType, getFileType] = useState("image");
  const [caption, getCaption] = useState("");
  const [dataForm, setDataForm] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Store the selected image file
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const baseUrl = "http://localhost:8000/api";




  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      console.log('Selected file name:', selectedFile.name);
      console.log('Selected file type:', selectedFile.type);
      console.log('Selected file size (in bytes):', selectedFile.size);
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(selectedFile);
  
      videoElement.addEventListener('loadedmetadata', () => {
        const duration = videoElement.duration;
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;
        const videoSrc = videoElement.currentSrc;
  
        console.log('Duration: ' + duration + ' seconds');
        console.log('Video width: ' + videoWidth + ' pixels');
        console.log('Video height: ' + videoHeight + ' pixels');
        console.log('Video source URL: ' + videoSrc);
    });
  }
  };
  
  const handleFileTypeChange = (e) => {
    getFileType(e.target.value);
  };

  const handleBackClick = () => {
    navigate(`/brand/campaigns`);

  };


  const handleImageChange = (event) => {
    // const selectedFiles = Array.from(e.target.files);

    // Check file extensions based on the selected file type

    
    const allowedExtensions = fileType === "image" ? ["jpg", "jpeg"] : ["mp4", "gif"];

    // const invalidFiles = selectedFiles.filter((file) => {
    //   const extension = file.name.split(".").pop().toLowerCase();
    //   return !allowedExtensions.includes(extension);
    // });




    const selectedFile = event.target.files[0];

    if (selectedFile) {
      console.log('Selected file name:', selectedFile.name);
      console.log('Selected file type:', selectedFile.type);
      console.log('Selected file size (in bytes):', selectedFile.size);
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(selectedFile);
  
      videoElement.addEventListener('loadedmetadata', () => {
        const duration = videoElement.duration;
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;
        const videoSrc = videoElement.currentSrc;
  
        console.log('Duration: ' + duration + ' seconds');
        console.log('Video width: ' + videoWidth + ' pixels');
        console.log('Video height: ' + videoHeight + ' pixels');
        console.log('Video source URL: ' + videoSrc);
    });
  }

    // if (invalidFiles.length > 0) {
    //   toast.error(`Invalid file format. Only ${allowedExtensions.join(", ")} files are allowed.`);
    //   e.target.value = null;
    //   return;
    // }

    
    // Check file limit (max 3 files)
    // if (selectedFiles.length > 5) {
    //   toast.error("You can only select up to 5 images.");
    //   e.target.value = null;
    //   return;
    // }

    setImageFiles(selectedFile);
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

    await axios.post(baseUrl+"/brand/create-campaign", dataForm, {
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

        <Grid container spacing="2">
          <Grid item xs={8}>
            <form action="#" method="post" enctype="multipart/form-data">
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
                    label="Image"
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
                  multiple
                  onChange={handleImageChange}
                />
{/* 
<input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      /> */}
              
              <ToastContainer autoClose={2500}/>
              


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
    
    </>
  );
}

export default CreateCampaign;
