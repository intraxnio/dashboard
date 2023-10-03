import React, { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Box,
  Grid,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useEffect } from "react";
import axios from "axios";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';



function CreateCampaign() {

  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [campaignName, getCampaignName] = useState("");
  const [fileType, getFileType] = useState("image");
  const [title, getTitle] = useState("");
  const [caption, getCaption] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Store the selected image file


  async function getUserId() {
    // await axios.get("http://localhost:8000/api/v1/brand/getUser", {
      await axios.get("https://app.buzzreach.in/api/v1/brand/getUser", {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data.data;

        if (!data || data === null) {
          setIsLoggedIn(false);
        } else {
          setUserId(data);
          setIsLoggedIn(true);
        }
      })
      .catch((e) => {});
  }

  useEffect(() => {
    getUserId();
  }, []);

  
  const handleFileTypeChange = (e) => {
    getFileType(e.target.value);
  };

  const handleBackClick = () => {
    navigate(`/brand/campaigns`);

  };


  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Check file extensions based on the selected file type
    const allowedExtensions = fileType === "image" ? ["jpg", "jpeg"] : ["mp4", "gif"];

    const invalidFiles = selectedFiles.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return !allowedExtensions.includes(extension);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid file format. Only ${allowedExtensions.join(", ")} files are allowed.`);
      e.target.value = null;
      return;
    }

    
    // Check file limit (max 3 files)
    if (selectedFiles.length > 5) {
      toast.error("You can only select up to 5 images.");
      e.target.value = null;
      return;
    }

    setImageFiles(selectedFiles);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    formData.append('campaignName', campaignName);
    formData.append('title', title);
    formData.append('caption', caption);
    formData.append('publishDate', selectedDate);
    formData.append('fileType', fileType);
    formData.append('userId', userId);
  
    imageFiles.forEach((file, index) => {
      formData.append(`images`, file);
    });

    if( !campaignName || !caption || !selectedDate){
      toast.warning("All fields are mandatory");
    }

    else if( !campaignName.trim() || !caption.trim()){
      toast.warning("Invalid input information");
    }

    else if( campaignName.length < 8){
      toast.warning("Campaign Name should be minimum 8 characters");
    }

    else if( caption.length < 50){
      toast.warning("Caption should be minimum 50 characters");
    }

    else if( imageFiles.length === 0){
      toast.warning("Please upload media file(s)");
    }

    else
    {

      // await axios.post("http://localhost:8000/api/v1/brand/create-campaign", formData, {
        await axios.post("https://app.buzzreach.in/api/v1/brand/create-campaign", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        toast.success("Campaign created successfully!");
        navigate("/brand/campaigns");
      })
      .catch((e) => {
        // Handle errors
      });
    }

  
  
  };
  
  


  return (
    <>
   <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button>


      {isLoggedIn ? (
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
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      ) : ( <Typography>Please login</Typography> )}
    </>
  );
}

export default CreateCampaign;
