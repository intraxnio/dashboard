import React, { useState, useEffect, useRef } from "react";
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
  Accordion,
  AccordionSummary,
  FormControl,
InputLabel,
Select,
MenuItem,
  Dialog, AccordionDetails, DialogActions, DialogContent, Typography, Alert, AlertTitle, RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import axios from "axios";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CircularProgress from '@mui/material/CircularProgress';
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useTheme from '@mui/system/useTheme';

// import dayjs from 'dayjs';
// import samplePost from '../../images/IMG_2533.jpg'


function CreateCampaign() {


  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const [linkTitle, setLinkTitle] = useState("");
  const [socialTitle, setSocialTitle] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [socialDescription, setSocialDescription] = useState("");
  const [fileType, getFileType] = useState("url");
  const fileInputRef = useRef(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [socialImageFile, setSocialImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const user = useSelector((state) => state.brandUser);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedButton, setSelectedButton] = useState('socialSharing');
  const [allTrackingCodes, setAllTrackingCodes] = useState([ ]);
  const [selectedTrackingOption, setSelectedTrackingOption] = useState('');
  const [isAddCodeDialogOpen, setIsAddCodeDialogOpen] = useState(false);
  const [newTrackingCodeName, setNewTrackingCodeName] = useState('');
  const [selectedTrackingId, setSelectedTrackingId] = useState('');
  const [newCodeScript, setNewCodeScript] = useState('');
  const [pdfPassword, setPdfPassword] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState("false");
  const baseUrl = "http://localhost:8001/usersOn";
  const httpsText = 'https://';

  const containerRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchMove = (event) => {
    if (touchStartX !== null) {
      const touchMoveX = event.touches[0].clientX;
      const deltaX = touchMoveX - touchStartX;
      if (containerRef.current) {
        containerRef.current.scrollLeft -= deltaX;
      }
      setTouchStartX(touchMoveX);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };


  const handleFileTypeChange = (e) => {
    getFileType(e.target.value);
  };

  const handleFileProtected = (e) => {
    setIsPasswordProtected(e.target.value);
  };


  const handleTrackingChange = (event) => {
    const selectedCode = allTrackingCodes.find((code) => code.tracking_code_name === event.target.value);
    setSelectedTrackingId(selectedCode?._id || ''); // Use optional chaining for safety
    setSelectedTrackingOption(event.target.value); // Update the selected option
  };

  const getTrackingCodes = (async () => {

    try {
      axios.post(baseUrl + "/get-user-tracking-codes", { userId : user.user_id}).then(catResult => {
  
        setAllTrackingCodes(catResult.data.data);
  
      }).catch(er => {
        // Handle error
      });
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
   
            getTrackingCodes();
 
  }, []);

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };


  const addTrackingCode = () => {

    axios.post(baseUrl + "/add-tracking-code", {
      userId: user.user_id,
      tracking_code_name: newTrackingCodeName,
      newCodeScript : newCodeScript
    })
    .then((ress) => {
      if (ress.data.added) {
          toast.success("New Tracking Code Added");
          getTrackingCodes();
      } else if (!ress.data.success) {
          toast.success("Please try again");
      }
    })
    .catch((e) => {
      // Handle error
    });
};

const handleImageChange = (e) => {
  const selectedFile = e.target.files[0];

  // Check if a file is selected
  if (selectedFile) {
    // Read the contents of the selected image file
    const reader = new FileReader();

    reader.onloadend = () => {
      // Set the image preview
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(selectedFile);

    // Set the selected image file
    setSocialImageFile(selectedFile);
  }
};

const handleUploadButtonClick = () => {
  // Trigger the file input when the button is clicked
  fileInputRef.current.click();
};

  
  const renderAdditionalFields = () => {
    // Render additional fields based on the selected button
    switch (selectedButton) {
     
      case 'socialSharing':
        return (

          <>
         
          <TextField
                        sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                        type="text"
                        id="socialTitle"
                        onChange={(e) => {
                          setSocialTitle(e.target.value);
                        }}
                        value={socialTitle}
                        margin="normal"
                        variant="outlined"
                        label="Social Title"
                        fullWidth
                       
                      ></TextField>


                      <TextField
                      sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                      type="text"
                      id="socialDescription"
                      onChange={(e) => {
                        setSocialDescription(e.target.value);
                      }}
                      value={socialDescription}
                      margin="normal"
                      variant="outlined"
                      label="Social Description"
                      fullWidth
                      multiline
                     
                    ></TextField>

                <Grid container alignItems="center" marginTop={2}>


                        <input
                type="file"
                name="socialImage"
                accept=".jpg, .jpeg"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />

              {/* Custom-styled button */}
              <Button variant="contained" color="primary" onClick={handleUploadButtonClick}>
                Upload Image
              </Button>

                  {imagePreview && (
                          <div style={{ marginTop: '10px', marginLeft : '10px' }}>
                            <img
                              src={imagePreview}
                              alt="Selected Image"
                              style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                          </div>
                        )}

                    </Grid>

                    </>

        );

        case 'utmTags':
          return (
  
            <>
           
            <TextField
                          sx={{ background : '#FFFFFF', borderColor : '#FFFFFF', marginTop: '26px'}}
                          type="text"
                          id="utmSource"
                          onChange={(e) => {
                            setUtmSource(e.target.value);
                          }}
                          value={utmSource}
                          margin="normal"
                          variant="outlined"
                          label="UTM Source"
                          fullWidth
                          InputLabelProps={{
                            shrink: true, // Always show the label above the input
                          }}
                           placeholder="Ex: Facebook, Twitter"
                         
                        ></TextField>
  
                        <TextField
                          sx={{ background : '#FFFFFF', borderColor : '#FFFFFF', marginTop: '12px'}}
                          type="text"
                          id="utmMedium"
                          onChange={(e) => {
                            setUtmMedium(e.target.value);
                          }}
                          value={utmMedium}
                          margin="normal"
                          variant="outlined"
                          label="UTM Medium"
                          fullWidth
                          InputLabelProps={{
                            shrink: true, // Always show the label above the input
                          }}
                           placeholder="Ex: Email, Banner"
                         
                        ></TextField>


                        <TextField
                          sx={{ background : '#FFFFFF', borderColor : '#FFFFFF', marginTop: '12px'}}
                          type="text"
                          id="utmCampaign"
                          onChange={(e) => {
                            setUtmCampaign(e.target.value);
                          }}
                          value={utmCampaign}
                          margin="normal"
                          variant="outlined"
                          label="UTM Campaign"
                          fullWidth
                          InputLabelProps={{
                            shrink: true, // Always show the label above the input
                          }}
                           placeholder="Ex: abc_campaign"
                         
                        ></TextField>

  
                      </>
  
          );

      case 'trackingCodes':
        return (

            <Stack sx={{ display: 'flex', flexDirection : 'row'}}>

            <FormControl fullWidth >
            {selectedTrackingOption ? null :  <InputLabel  sx={{ marginTop: '16px' }} id="code-name" >Select tracking codes</InputLabel>}
            <Select
            id="tracking-codes"
            value={selectedTrackingOption}
            onChange={handleTrackingChange}
            sx={{ marginTop : '16px'}}
             >
            {
            allTrackingCodes.length === 0 ? ( <Typography> No codes</Typography>) : (
            allTrackingCodes.map((codeName) => (
            <MenuItem key={codeName.tracking_code_name} value={codeName.tracking_code_name}>
            {codeName.tracking_code_name}
            </MenuItem>
            )))}

            </Select>
            </FormControl>

            <Button onClick= {handleCodeOpenDialog} variant='outlined' success size='small' sx={{ marginTop : '16px', marginLeft: '6px'}}>Add</Button>
            </Stack>


        );
      default:
        return null;
    }
  };


  const handleCodeOpenDialog = () => {

    setIsAddCodeDialogOpen(true); // Open the dialog

};



  const handleRedirectUrl = (e) => {
    const value = e.target.value;
    setRedirectTo((prevUserInput) => {
      if (value.startsWith('https://')) {
        return value;
      } else {
        return 'https://' + value;
      }
    });
  };

  const today = new Date();
  today.setDate(today.getDate() + 1); // Set the minimum allowed date to tomorrow



  const handleBackClick = () => {
    navigate(`/brand/linksCard`);

  };

  const handleButtonClick = (button) => {
    // Handle button click and update the selectedButton state
    setSelectedButton(button);
  };

  const handleCodeCloseDialog = () => {
    setIsAddCodeDialogOpen(false); // Close the dialog
  };


  
  const submitLink = async() =>{

    setLoading(true);


      if(fileType === 'pdf'){

        
        if( !linkTitle ){
          setLoading(false);
          toast.warning("Link Title is mandatory");
        }

       else if( !pdfFile ){
          setLoading(false);
          toast.warning("Please upload file");
        }
        else {

          const FormData = require("form-data");

          const formData = new FormData();
          formData.append("userId", user.user_id);
          formData.append("linkTitle", linkTitle);
          formData.append("fileType", fileType);
          formData.append("pdfFile", pdfFile);
          formData.append("isPasswordProtected", isPasswordProtected);
          formData.append("pdfPassword", pdfPassword);
          
          await axios.post(baseUrl + "/create-link-pdf", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          })
      .then((res) => {
        if(res.data.created){

          setLoading(false);
          toast.success("Link Created & Copied !!");
          navigate("/brand/linksCard");
        }

        })
        .catch((e) => {
          // Handle errors
        });


      }
    }

      else if(fileType === 'url'){

        if( !linkTitle || linkTitle.trim() === ''){
          setLoading(false);
          toast.warning("Link Title is mandatory");
        }

       else if( !redirectTo || redirectTo.trim() === ''){
          setLoading(false);
          toast.warning("Destinatin URL is required");
        }

        else if( socialTitle.trim() !== '' && ( !socialDescription || socialDescription.trim() === ''))
        {

          setLoading(false);
          toast.warning("Please enter Social Description");

        }

        else if( socialTitle.trim() !== '' && !socialImageFile )
        {

          setLoading(false);
          toast.warning("Please Upload Image");

        }

        else{

          const FormData = require("form-data");

          const formData = new FormData();
          formData.append("userId", user.user_id);
          formData.append("redirectUrl", redirectTo);
          formData.append("linkTitle", linkTitle);
          formData.append("selectedTrackingId", selectedTrackingId);
          formData.append("socialTitle", socialTitle);
          formData.append("socialDescription", socialDescription);
          formData.append("socialImage", socialImageFile);
          formData.append("utmSource", utmSource);
          formData.append("utmMedium", utmMedium);
          formData.append("utmCampaign", utmCampaign);
          
          await axios.post(baseUrl + "/create-link", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          })
    .then((res) => {
        setLoading(false);
        toast.success("Link Created & Copied !!");
        navigate("/brand/linksCard");
      })
      .catch((e) => {
        // Handle errors
      });
    }
    }



  }


  return (
    <>
   <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button>

        <Grid container>

                <Grid item xs={12} sm={10} md={8}>
                    <Box
                      display="flex"
                      flexDirection={"column"}
                      maxWidth={500}
                      margin="auto"
                      padding={1}
                    >
                      
                      {/* <TextField
                        sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                        type="text"
                        id="linkTo"
                        value={redirectTo.replace(/^https:\/\//, '')}
                        onChange={handleRedirectUrl}
                        margin="normal"
                        variant="outlined"
                        label="Destination URL"
                        InputLabelProps={{
                         shrink: true, // Always show the label above the input
                       }}
                       InputProps={{
                        startAdornment: (
                          <span style={{ color: '#A9A9A9' }}>{httpsText}</span>
                        ),
                      }}
                      ></TextField> */}



                      <TextField
                        sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                        type="text"
                        id="linkTitle"
                        onChange={(e) => {
                          setLinkTitle(e.target.value);
                        }}
                        margin="normal"
                        variant="outlined"
                        label="Link Title"
                        InputLabelProps={{
                          shrink: true, // Always show the label above the input
                        }}
                         placeholder="Link Title"
                      ></TextField>

                        <RadioGroup
                            row
                            name="link-type-group"
                            aria-label="link-type-group"
                            value={fileType}
                            onChange={handleFileTypeChange}
                            sx={{ marginBottom : '16px'}}

                          >
                            <FormControlLabel
                              control={<Radio />}
                              label="Destination URL"
                              value="url"
                            />
                            <FormControlLabel
                              control={<Radio />}
                              label="PDF"
                              value="pdf"
                            />
                          </RadioGroup>

                          {fileType === "url" && (
                            <>
                            <TextField
                              sx={{ background: '#FFFFFF', borderColor: '#FFFFFF' }}
                              type="text"
                              id="linkTo"
                              value={redirectTo.replace(/^https:\/\//, '')}
                              onChange={handleRedirectUrl}
                              margin="normal"
                              variant="outlined"
                              label="Destination URL"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                startAdornment: (
                                  <span style={{ color: '#A9A9A9' }}>{httpsText}</span>
                                ),
                              }}
                            />

                            <Accordion sx={{ marginTop: '16px', background: '#F5F7F8', border: '1px solid #ddd'}} elevation={0}>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="advanced-content"
                              id="advanced-header"
                            >
                              <Typography sx={{ color: '#67729D' }}>
                                Advanced (optional)
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
              
                            <div
      ref={containerRef}
      style={{
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        maxWidth: '100%', // Set a maximum width for the container
        overflow: 'hidden',

      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: theme.spacing(1),
        }}
      >
        <Button
          variant={selectedButton === 'socialSharing' ? 'contained' : 'outlined'}
          size="medium"
          sx={{
            flex: '1', // Allow the button to grow
            overflow: 'auto',
            textOverflow: 'ellipsis',
           minWidth : { xs : 150 }
          }}
          onClick={() => handleButtonClick('socialSharing')}
        >
          Social Sharing
        </Button>

        <Button
          variant={selectedButton === 'utmTags' ? 'contained' : 'outlined'}
          size="small"
          sx={{
            flex: '1',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth : { xs : 100 }
          }}
          onClick={() => handleButtonClick('utmTags')}
        >
          UTM Tags
        </Button>

        <Button
          variant={selectedButton === 'trackingCodes' ? 'contained' : 'outlined'}
          size="medium"
          sx={{
            flex: '1',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth : { xs : 160 }
          }}
          onClick={() => handleButtonClick('trackingCodes')}
        >
          Tracking Codes
        </Button>
      </Stack>
    </div>


                  {renderAdditionalFields()}
                </AccordionDetails>
                          </Accordion>
                          </>
                          )}

                          {fileType === "pdf" && (
                            <>
                            <input
                              type="file"
                              name="pdfFile"
                              accept=".pdf"
                              onChange={(e) => setPdfFile(e.target.files[0])}
                            />

                <Grid container alignItems="center" marginTop={2}>
                      <Grid item>
                        <Typography variant="body1" marginRight={10}>Secure PDF </Typography>
                      </Grid>
                      <Grid item>
                        <RadioGroup
                          row
                          name="link-type-group"
                          aria-label="link-type-group"
                          value={isPasswordProtected}
                          onChange={handleFileProtected}
                        >
                          <FormControlLabel control={<Radio />} label="No" value="false" />
                          <FormControlLabel control={<Radio />} label="Yes" value="true" />
                        </RadioGroup>

                      </Grid>
                    </Grid>

    {isPasswordProtected === "true" && (
          <TextField
            type="password"
            id="pdfPassword"
            value={pdfPassword}
            onChange={(e) => setPdfPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            label="PDF Password"
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}

                           
                          </>
                          )}


          


                    
                    <ToastContainer autoClose={3000}/>
                    

                      <Button
                        variant="contained"
                        label="Next"
                        size="large"
                        endIcon={<ArrowRightAltIcon />}
                        sx={{
                          marginTop: "30px",
                          maxWidth: "250px",
                        }}
                        onClick={submitLink}
                      >
                        Create Link
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
                </Grid>

                <Grid item xs={4}>
              </Grid>

        </Grid>

{/* Create New Code Dialog  */}

        {allTrackingCodes && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isAddCodeDialogOpen}
            onClose={handleCodeCloseDialog}
            disableEscapeKeyDown
            keepMounted
            fullWidth
          >
            <DialogContent
            fullWidth>
            <Box
                      display="flex"
                      flexDirection={"column"}
                      margin="auto"
                      padding={1}
                      sx={{ width: '450px'}}
                    >

                        <TextField
                        type="text"
                        id="addNewCode"
                        onChange={(e) => {
                            setNewTrackingCodeName(e.target.value);
                          }}
                        margin="normal"
                        variant="outlined"
                        label="Tracking Code Name"
                        InputLabelProps={{
                         shrink: true, // Always show the label above the input
                       }}
                    

                      ></TextField>

                        <TextField
                        type="text"
                        id="codeScript"
                        multiline
                        rows={9}
                        onChange={(e) => {
                            setNewCodeScript(e.target.value);
                          }}
                        margin="normal"
                        variant="outlined"
                        label="Script"
                       
                    

                      ></TextField>



                      </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCodeCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                    addTrackingCode();
                  handleCodeCloseDialog();
                }}
                color="success"
              >
                Save Script
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
